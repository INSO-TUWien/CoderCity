import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

@Schema()
export class ProjectSnapshot extends Document {
    @Prop()
    projectId: string;

    @Prop()
    commitId: string;

    @Prop()
    data: string;
}

export const ProjectSnapshotDataSchema = SchemaFactory.createForClass(ProjectSnapshot);