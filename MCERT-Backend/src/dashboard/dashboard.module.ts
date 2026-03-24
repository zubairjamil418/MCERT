import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { FormsModule } from '../forms/forms.module';
import { SecondFormsModule } from '../second-forms/second-forms.module';
import { thirdFormsModule } from '../third-forms/third-forms.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from '../forms/entities/form.entity';
import {
  SecondForm,
  SecondFormSchema,
} from '../second-forms/entities/second-form.entity';
import {
  thirdForm,
  thirdFormSchema,
} from '../third-forms/entities/third-form.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Form.name, schema: FormSchema },
      { name: SecondForm.name, schema: SecondFormSchema },
      { name: thirdForm.name, schema: thirdFormSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
