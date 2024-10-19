// Interface for a Room
export interface Room {
  id: string;
  name: string;
  description: string;
  code: string;
  templateId: string; // The ID of the associated template
  createdAt: string;
  updatedAt: string;
}

// Interface for Room Form Values (used for creating or updating a room)
export interface RoomFormValues {
  name: string;
  description: string;
}

// Interface for Room Creation Input
export interface RoomCreateInput {
  name: string;
  description: string;
  code: string;
  templateId: string; // The ID of the associated template
}

// Interface for Room Update Input (if you need to update rooms)
export interface RoomUpdateInput {
  name?: string;
  description?: string;
  code?: string;
}
