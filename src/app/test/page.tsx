import BackPageLayout from "@/components/BackPageLayout";

export default function TestPage() {
  return (
    <BackPageLayout title="Test" accentColor="#4A6FA5">
      <p style={{ color: "#6B87B8", fontSize: 15 }}>Run diagnostic tests here.</p>
    </BackPageLayout>
  );
}