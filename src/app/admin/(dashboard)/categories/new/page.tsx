import AdminHeader from "@/components/admin/AdminHeader";
import TermForm from "@/components/admin/TermForm";
import { createCategoryAction } from "@/app/admin/actions";
import { listCategories } from "@/lib/admin-api";

export default async function NewCategoryPage() {
  const categories = await listCategories();
  return (
    <div>
      <AdminHeader title="Add Category" />
      <div className="p-4 sm:p-7">
        <TermForm
          withImage
          action={createCategoryAction}
          submitLabel="Create Category"
          parentCategories={categories.filter((category) => !category.parent_id)}
        />
      </div>
    </div>
  );
}
