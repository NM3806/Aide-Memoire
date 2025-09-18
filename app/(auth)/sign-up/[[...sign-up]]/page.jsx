import AuthLayout from "@/components/layout/AuthLayout";
import { SignUp } from "@clerk/nextjs";


export default function Page() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organizing your docs beautifully."
    >
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 text-primary-foreground",
            card: "shadow-lg border border-border rounded-2xl bg-card p-6",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          },
        }}
      />
    </AuthLayout>
  );
}
