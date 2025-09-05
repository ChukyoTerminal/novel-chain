export interface User{
  id:string;
  name:string;
  email: string;
  avatarUrl?: string;
  rating:number;
  display_name:string;
  follower_count:string;
  created_at:string;
  updated_at:string;
  threads:Thread[];
  posts:Post[];
}

export interface Thread{
  id:string;
  title:string;
  rating:number;
  owner:User;
  posts:Post[];
  tags:string[];
  summary: string;
  created_at:string;
  updated_at:string;
}

export interface Post{
  id:string;
  thread_id:string;
  content:string;
  author:User;
  created_at:string;
  updated_at:string;
}

