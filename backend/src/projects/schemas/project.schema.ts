import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  client: string;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop({ required: true, enum: ['Planning', 'In Progress', 'Completed'], default: 'Planning' })
  status: string;

  @Prop({ required: true, min: 0 })
  budget: number;

  @Prop({ trim: true, default: '' })
  description: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
