import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class ProjectCommitData extends Document {
    @Prop()
    projectId: string;

    @Prop()
    data: string;
}

export const ProjectCommitDataSchema = SchemaFactory.createForClass(ProjectCommitData);