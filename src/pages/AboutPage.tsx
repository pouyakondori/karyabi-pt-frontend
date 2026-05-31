import React from 'react'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-8 text-white shadow-md">
        <h1 className="text-3xl font-bold">درباره ما</h1>
        <p className="mt-4 text-slate-100 max-w-3xl leading-relaxed">
          به <strong className="font-semibold">Karyabi.pt</strong> خوش آمدید؛ پلتفرمی که با هدف
          پیوند دادن تخصص، مهارت و نیازهای شغلی جامعه ایرانیان مقیم پرتغال شکل گرفته است. ما به
          همبستگی، حمایت و توانمندسازی اقتصادی معتقدیم.
        </p>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-emerald-700">چرا Karyabi.pt؟</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            در روزگار چالش‌ها، ما بستری امن و رایگان برای اتصال کارفرماها و کارجویان فراهم می‌کنیم.
          </p>
        </article>

        <article className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-emerald-700">چطور کار می‌کنیم</h2>
          <ul className="mt-3 list-inside list-disc text-slate-700 leading-relaxed">
            <li>ثبت و درخواست آسان برای کارفرما و کارجو</li>
            <li>پلتفرم متن‌باز و قابل مشارکت توسط جامعه</li>
            <li>حفظ امنیت و شفافیت در فرایندها</li>
          </ul>
        </article>

        <article className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-emerald-700">هدف ما</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            کاهش دغدغه‌های مالی هموطنان و ایجاد شبکه‌ای قوی میان کسب‌وکارها و متخصصان ایرانی در
            پرتغال.
          </p>
        </article>

        <article className="col-span-full rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-emerald-700">مشارکت و توسعه</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            اگر توسعه‌دهنده هستید، خوشحال می‌شویم در مخزن گیت‌هاب مشارکت کنید.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              className="rounded-full border border-emerald-600 px-4 py-2 text-emerald-600 hover:bg-emerald-50"
              href="https://github.com/pouyakondori/karyabi-pt-frontend"
              rel="noreferrer"
              target="_blank"
            >
              مخزن فرانت‌اند
            </a>
            <a
              className="rounded-full border border-emerald-600 px-4 py-2 text-emerald-600 hover:bg-emerald-50"
              href="https://github.com/pouyakondori/karyabi-pt-backend"
              rel="noreferrer"
              target="_blank"
            >
              مخزن بک‌اند
            </a>
          </div>
        </article>

        <article className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-emerald-700">تماس</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            اگر سؤال یا پیشنهادی دارید، با تیم توسعه تماس بگیرید. ما با شما همکاری می‌کنیم.
          </p>
        </article>

        <article className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold text-emerald-700">با هم، برای هم</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">تیم توسعه و پشتیبانی Karyabi.pt</p>
        </article>
      </section>
    </div>
  )
}
