import Builder from "@/components/builder";
import { getPost, type Post } from "@/manager";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post: Post = await getPost(id);

  return <Builder post={post} />;
}
