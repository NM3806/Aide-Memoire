import AuthLayout from "@/components/layout/AuthLayout";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your notes journey."
    >
      <SignIn
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
