import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Form } from '../forms/entities/form.entity';
import { SecondForm } from '../second-forms/entities/second-form.entity';
import { thirdForm } from '../third-forms/entities/third-form.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Form.name) private readonly formModel: Model<Form>,
    @InjectModel(SecondForm.name)
    private readonly secondFormModel: Model<SecondForm>,
    @InjectModel(thirdForm.name)
    private readonly thirdFormModel: Model<thirdForm>,
  ) {}

  async getStats(userId?: string) {
    const userFilter = userId ? { userId } : {};

    const [form1Stats, form2Stats, form3Stats] = await Promise.all([
      this.getFormTypeStats(this.formModel, userFilter),
      this.getFormTypeStats(this.secondFormModel, userFilter),
      this.getFormTypeStats(this.thirdFormModel, userFilter),
    ]);

    // Monthly trend — last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [monthlyForm1, monthlyForm2, monthlyForm3] = await Promise.all([
      this.getMonthlyTrend(this.formModel, userFilter, sixMonthsAgo),
      this.getMonthlyTrend(this.secondFormModel, userFilter, sixMonthsAgo),
      this.getMonthlyTrend(this.thirdFormModel, userFilter, sixMonthsAgo),
    ]);

    const monthlyTrend = this.mergeMonthlyTrends(
      monthlyForm1,
      monthlyForm2,
      monthlyForm3,
    );

    // Upcoming validations from Form 2 & 3 (they have nextFlowValidationDate)
    const [validations2, validations3] = await Promise.all([
      this.getUpcomingValidations(this.secondFormModel, userFilter, 'Form 2'),
      this.getUpcomingValidations(this.thirdFormModel, userFilter, 'Form 3'),
    ]);
    const upcomingValidations = [...validations2, ...validations3].sort(
      (a, b) => new Date(a.validationDue).getTime() - new Date(b.validationDue).getTime(),
    );

    // Recent inspections — last 10 across all types
    const [recent1, recent2, recent3] = await Promise.all([
      this.getRecentInspections(this.formModel, userFilter, 'Form 1'),
      this.getRecentInspections(this.secondFormModel, userFilter, 'Form 2'),
      this.getRecentInspections(this.thirdFormModel, userFilter, 'Form 3'),
    ]);
    const recentInspections = [...recent1, ...recent2, ...recent3]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      totalForms:
        form1Stats.total + form2Stats.total + form3Stats.total,
      pending:
        form1Stats.pending + form2Stats.pending + form3Stats.pending,
      submitted:
        form1Stats.submitted + form2Stats.submitted + form3Stats.submitted,
      thisMonth:
        form1Stats.thisMonth + form2Stats.thisMonth + form3Stats.thisMonth,
      byFormType: {
        form1: form1Stats.total,
        form2: form2Stats.total,
        form3: form3Stats.total,
      },
      monthlyTrend,
      upcomingValidations,
      recentInspections,
    };
  }

  private async getFormTypeStats(model: Model<any>, userFilter: any) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, pending, submitted, thisMonth] = await Promise.all([
      model.countDocuments(userFilter),
      model.countDocuments({ ...userFilter, status: 'pending' }),
      model.countDocuments({ ...userFilter, status: 'submitted' }),
      model.countDocuments({
        ...userFilter,
        createdAt: { $gte: startOfMonth },
      }),
    ]);

    return { total, pending, submitted, thisMonth };
  }

  private async getMonthlyTrend(
    model: Model<any>,
    userFilter: any,
    since: Date,
  ) {
    return model.aggregate([
      { $match: { ...userFilter, createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  }

  private mergeMonthlyTrends(
    form1: any[],
    form2: any[],
    form3: any[],
  ) {
    const months: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }

    const toMap = (arr: any[]) => {
      const m: Record<string, number> = {};
      for (const item of arr) {
        const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
        m[key] = item.count;
      }
      return m;
    };

    const m1 = toMap(form1);
    const m2 = toMap(form2);
    const m3 = toMap(form3);

    return months.map((key) => ({
      month: key,
      form1: m1[key] || 0,
      form2: m2[key] || 0,
      form3: m3[key] || 0,
      total: (m1[key] || 0) + (m2[key] || 0) + (m3[key] || 0),
    }));
  }

  private async getUpcomingValidations(
    model: Model<any>,
    userFilter: any,
    formType: string,
  ) {
    const docs = await model
      .find({
        ...userFilter,
        'formData.nextFlowValidationDate': { $exists: true, $ne: '' },
      })
      .select(
        '_id status formData.siteName formData.nextFlowValidationDate formData.dateOfInspection createdAt',
      )
      .lean();

    const now = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    return docs
      .map((doc: any) => {
        const rawDate = doc.formData?.nextFlowValidationDate;
        if (!rawDate) return null;

        const validationDate = this.parseFlexibleDate(rawDate);
        if (!validationDate) return null;

        // Include overdue and upcoming within 90 days
        if (validationDate > ninetyDaysFromNow) return null;

        const daysUntil = Math.ceil(
          (validationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        let urgency: string;
        if (daysUntil < 0) urgency = 'overdue';
        else if (daysUntil <= 30) urgency = 'urgent';
        else urgency = 'upcoming';

        return {
          formId: doc._id.toString(),
          formType,
          siteName: doc.formData?.siteName || 'Unknown',
          lastInspection: doc.formData?.dateOfInspection || '',
          validationDue: validationDate.toISOString(),
          daysUntil,
          urgency,
          status: doc.status,
        };
      })
      .filter(Boolean);
  }

  private parseFlexibleDate(raw: string): Date | null {
    if (!raw) return null;
    // Try ISO / standard parse first
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d;

    // Try ordinal format "22nd May 2025"
    const cleaned = raw.replace(/(st|nd|rd|th)/i, '');
    const d2 = new Date(cleaned);
    if (!isNaN(d2.getTime())) return d2;

    // Try DD/MM/YYYY
    const parts = raw.split('/');
    if (parts.length === 3) {
      const d3 = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      if (!isNaN(d3.getTime())) return d3;
    }

    return null;
  }

  private async getRecentInspections(
    model: Model<any>,
    userFilter: any,
    formType: string,
  ) {
    const docs = await model
      .find(userFilter)
      .select(
        '_id status formData.siteName formData.inspector formData.dateOfInspection createdAt',
      )
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return docs.map((doc: any) => ({
      id: doc._id.toString(),
      formType,
      siteName: doc.formData?.siteName || 'Unknown',
      inspector: doc.formData?.inspector || '',
      status: doc.status || 'pending',
      dateOfInspection: doc.formData?.dateOfInspection || '',
      createdAt: doc.createdAt,
    }));
  }
}
