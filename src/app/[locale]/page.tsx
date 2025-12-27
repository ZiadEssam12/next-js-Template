import { getTranslations, setRequestLocale } from "next-intl/server";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("hero");

  return (
    <main className="w-full min-h-screen flex flex-col gap-3 items-center justify-center">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p>{t("subtitle")}</p>
    </main>
  );
}
