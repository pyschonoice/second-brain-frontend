// src/types/index.d.ts

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  accessToken?: string,
  data?: T; // Make data optional as not all responses have it directly
}

// Specific API response types for better type safety
export interface AuthApiData {
  token: string;
  user: User;
}

export interface TagApiData {
  title: string;
  userId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ContentApiData {
  _id: string;
  link?: string;
  title: string;
  typeofContent: 'link' | 'image' | 'video' | 'text'; // Corrected from typeOfContent
  tags: PopulatedTag[]; // Tags are populated
  userId: PopulatedUser; // userId is populated
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface User {
  _id: string;
  username: string;
  // Add other user properties if your backend provides them
}

// Populated User structure when returned within Content
export interface PopulatedUser {
  _id: string;
  username: string;
}

// Populated Tag structure when returned within Content
export interface PopulatedTag {
  _id: string;
  title: string; // From tag.controller.ts getTag response
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

// Request Payloads
export interface SignUpPayload {
  username: string;
  password: string;
}

export interface SignInPayload {
  username: string;
  password: string;
}

export interface CreateContentPayload {
  link?: string;
  typeofContent: 'link' | 'image' | 'video' | 'text'; // Matches backend enum
  title: string;
  tags?: string[]; // Array of tag IDs (strings) for creation
}

export interface DeleteContentPayload {
  contentId: string;
}

export interface CreateTagPayload {
  title: string;
}

export interface DeleteTagPayload {
  tagId: string;
}