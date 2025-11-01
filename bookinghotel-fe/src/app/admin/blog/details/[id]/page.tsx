interface BlogDetailProps {
  params: { id: string };
}

export default function BlogDetail({ params }: BlogDetailProps) {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Chi tiết bài viết ID: {params.id}
      </h1>
      <p>Đây là trang chi tiết của bài viết có ID = {params.id}</p>
    </div>
  );
}
