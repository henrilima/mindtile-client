import Builder from "@/components/builder";
import { getPost } from "@/actions";
import type { Post } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post: Post = await getPost(id);

  return <Builder post={post} />;
}
