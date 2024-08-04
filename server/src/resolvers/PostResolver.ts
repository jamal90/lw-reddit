import { Post } from "./../entities/Post";
import { AppContext } from "./../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: AppContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: AppContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id: id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Arg("userName") userName: string,
    @Ctx() { em }: AppContext
  ): Promise<Post | null> {
    const post = em.create(Post, { title, content, userName });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Ctx() { em }: AppContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id: id });
    if (post) {
      if (content) post.content = content;
      if (title) post.title = title;
      await em.persistAndFlush(post);
      return post;
    } else {
      return null;
    }
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: AppContext
  ): Promise<Boolean | null> {
    const rows = await em.nativeDelete(Post, { id });
    return rows > 0;
  }
}
