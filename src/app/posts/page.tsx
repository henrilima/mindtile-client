import { getPosts } from "@/actions";
import Posts from "./posts-client";

export default async function Page() {
  const posts = await getPosts();
  return <Posts posts={posts}></Posts>;
}
