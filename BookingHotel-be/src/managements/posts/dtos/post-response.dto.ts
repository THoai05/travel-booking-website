export class PostResponseDto {
  id: number;
  title: string;
  slug: string;
  image: string;
  content: string;
  is_public: boolean;
  created_at: Date;
  author: {
    id: number;
    username: string;
    fullName: string;
  };

  constructor(post: any) {
    this.id = post.id;
    this.title = post.title;
    this.slug = post.slug;
    this.image = post.image;
    this.content = post.content;
    this.is_public = post.is_public;
    this.created_at = post.created_at;
    this.author = {
      id: post.author?.id,
      username: post.author?.username,
      fullName: post.author?.fullName,
    };
  }
}
