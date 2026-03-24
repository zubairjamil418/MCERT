import { Module } from '@nestjs/common';
import { thirdFormsService } from './third-forms.service';
import { thirdFormsController } from './third-forms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { thirdForm, thirdFormSchema } from './entities/third-form.entity';
import { IamModule } from '../iam/iam.module';
import { thirdFileStorageService } from './third-file-storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: thirdForm.name,
        schema: thirdFormSchema,
      },
    ]),
    IamModule,
  ],
  controllers: [thirdFormsController],
  providers: [thirdFormsService, thirdFileStorageService],
  exports: [thirdFormsService, thirdFileStorageService],
})
export class thirdFormsModule {}

