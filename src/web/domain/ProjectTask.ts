export interface ProjectTask {
    id: number;
    name: string;
    description: string;
    dueDate: Date;
    order: number;
    priority: number;
    phase: string;
    externalUrl: string;
    estimatedTime: number;
    usedTime: number;
}