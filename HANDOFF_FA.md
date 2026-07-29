# راهنمای تحویل، اجرا و استقرار لندینگ فارسی

## 1. معرفی پروژه

این پروژه یک لندینگ‌پیج فارسی و راست‌به‌چپ برای سایت آموزشی رضا شکورزاد است. هدف صفحه این است که کاربر در اولین ورود، مسیر یادگیری خودش را بین دو شاخه اصلی انتخاب کند:

- هوش مصنوعی
- ریاضی

این نسخه با تمرکز روی ظاهر مدرن، دارک، سینمایی و تعاملی ساخته شده و شامل بک‌گراند سه‌بعدی، کارت‌های مسیر، CTA و انیمیشن‌های نرم است.

## 2. تکنولوژی‌های استفاده‌شده

- Vinext / Vite
- React
- TypeScript
- Three.js برای جلوه‌های سه‌بعدی و انیمیشن‌های تعاملی
- Motion برای انیمیشن‌های رابط کاربری
- Vazirmatn برای تایپوگرافی فارسی

## 3. وضعیت فعلی مخزن

```text
Repository: https://github.com/MrAshki/reza-shakourzad-landing
Branch: master
Latest pushed commit: 879948d
Project name: reza-shakourzad-landing
```

آخرین نسخه build و test شده و وضعیت پروژه روی GitHub push شده است.

## 4. امکانات فعلی

در نسخه فعلی این موارد پیاده‌سازی شده‌اند:

- صفحه لندینگ فارسی RTL
- طراحی dark / cinematic
- بک‌گراند Three.js تعاملی
- متن hero فارسی با CTA اصلی
- دکمه CTA: «همین حالا رایگان شروع کن»
- اسکرول نرم CTA به سکشن مسیرها
- هدر که هنگام اسکرول به پایین محو می‌شود
- کارت مسیر «هوش مصنوعی»
- کارت مسیر «ریاضی» با المان‌های ریاضی Three.js
- انیمیشن‌های نرم برای hero، کارت‌ها و CTAها
- تست HTML اولیه برای اطمینان از render شدن landing

## 5. محدوده‌ای که هنوز پیاده‌سازی نشده

این پروژه فعلاً فقط landing page است. موارد زیر هنوز داخل پروژه وجود ندارند:

- backend
- API اختصاصی
- دیتابیس
- احراز هویت / ورود کاربران
- فرم ثبت‌نام
- داشبورد کاربر
- پنل مدیریت
- پرداخت یا سیستم اشتراک
- صفحه assessment واقعی
- منطق آزمون تعیین سطح

مسیرهای زیر فعلاً رزرو شده‌اند و هنوز صفحه واقعی پشت آن‌ها ساخته نشده است:

```text
/assessment?path=ai
/assessment?path=math
```

## 6. دستورات نصب و اجرا

در ریشه پروژه اجرا شود:

```bash
npm install
```

اجرای محیط توسعه:

```bash
npm run dev
```

ساخت نسخه production:

```bash
npm run build
```

اجرای نسخه ساخته‌شده طبق اسکریپت پروژه:

```bash
npm run start
```

## 7. دستورات کنترل کیفیت

قبل از تحویل یا deploy، این دستورات اجرا شوند:

```bash
npm run format
npm run lint
npm run type-check
npm run build
npm test
```

در آخرین نسخه، همه این موارد با موفقیت پاس شده‌اند.

## 8. نیازمندی Node و محیط build

طبق `package.json`، حداقل نسخه Node موردنیاز:

```text
Node.js >= 22.13.0
```

پیشنهاد عملی:

```text
Node.js 22 LTS یا جدیدتر
npm همراه Node
سیستم لینوکس یا سرور سازگار با Node
```

## 9. حجم خروجی و bundle

بعد از build فعلی:

```text
dist: حدود 5.7MB
client assets: حدود 1.2MB خام
```

مهم‌ترین assetهای client:

```text
three.module: حدود 516KB
framework: حدود 188KB
animation: حدود 120KB
main index JS: حدود 80KB
CSS: حدود 32KB
LearningPaths chunk: حدود 12KB
BackgroundScene chunk: حدود 8KB
fonts: حدود 172KB
```

نکته مهم:

به دلیل استفاده از Three.js، در build هشدار chunk بزرگ‌تر از 500KB دیده می‌شود:

```text
Some chunks are larger than 500 kB after minification
```

این warning خطا نیست و build موفق است. اگر بعداً performance مهم‌تر شود، پیشنهاد می‌شود Three.js به صورت lazy/dynamic load و code-split شود.

## 10. پیشنهاد استقرار و سرور

چون پروژه در وضعیت فعلی backend و دیتابیس ندارد، فشار اصلی روی سرور کم است. پردازش گرافیکی Three.js سمت مرورگر کاربر انجام می‌شود.

### گزینه پیشنهادی برای شروع

برای traffic کم تا متوسط:

```text
1 vCPU
1GB RAM
Node.js 22.13+
SSD معمولی
HTTPS
CDN فعال
gzip یا Brotli compression
```

### گزینه مطمئن‌تر برای production

```text
2 vCPU
2GB RAM
Node.js 22.13+
Nginx یا Caddy به عنوان reverse proxy در صورت VPS
HTTPS
CDN
gzip/Brotli
```

### گزینه‌های مناسب deploy

#### Cloudflare

پروژه dependencyهای مرتبط با Cloudflare دارد:

```text
@cloudflare/vite-plugin
wrangler
```

بنابراین Cloudflare می‌تواند گزینه مناسبی برای deploy باشد، مخصوصاً اگر CDN و performance جهانی مهم باشد. با این حال، برای deploy نهایی ممکن است نیاز باشد اسکریپت deploy و config production دقیق اضافه شود.

#### VPS معمولی

روی VPS می‌توان این روند را اجرا کرد:

```bash
npm install
npm run build
npm run start
```

سپس بهتر است پشت Nginx یا Caddy قرار بگیرد و SSL فعال شود.

#### سرویس‌های managed

گزینه‌هایی مثل Vercel، Netlify، Render یا Railway هم قابل بررسی هستند، اما چون پروژه با Vinext و Cloudflare plugin تنظیم شده، قبل از انتخاب نهایی باید deploy آزمایشی روی همان پلتفرم انجام شود.

## 11. حداقل سخت‌افزار کاربر نهایی

چون Three.js سمت client اجرا می‌شود، سخت‌افزار کاربر در روان بودن تجربه اثر دارد.

### حداقل قابل قبول

برای اینکه سایت باز شود و قابل استفاده باشد:

```text
مرورگر مدرن با WebGL فعال
RAM حداقل 4GB
CPU دو هسته‌ای نسبتاً جدید
GPU یکپارچه معمولی
```

نمونه قابل قبول:

```text
Intel UHD 620 یا بهتر
Android با حداقل 3GB RAM
iPhone حدوداً مدل‌های 2018 به بعد
```

### پیشنهاد برای تجربه روان

برای تجربه نرم‌تر و بدون لگ محسوس:

```text
RAM: 8GB یا بیشتر
CPU چهار هسته‌ای
GPU یکپارچه جدید یا GPU مجزا
Chrome / Edge / Safari جدید
```

موبایل پیشنهادی:

```text
iPhone XS / XR به بالا
Android میان‌رده 2019 به بالا
Snapdragon 730 / 778G به بالا
حداقل 4GB RAM
```

### روی دستگاه ضعیف چه اتفاقی می‌افتد؟

- سایت احتمالاً همچنان load می‌شود.
- ممکن است انیمیشن‌ها افت فریم داشته باشند.
- مصرف باتری موبایل بیشتر می‌شود.
- load اولیه ممکن است کمی کندتر باشد، چون Three.js حجم اضافه دارد.

## 12. پیشنهادهای فاز بعدی

### فاز performance

- lazy-load کردن Three.js
- کاهش تعداد particles/objects روی موبایل
- اجرای Lighthouse
- بهینه‌سازی first load
- static کردن sceneها برای `prefers-reduced-motion`

### فاز محصول

- ساخت صفحه assessment واقعی
- طراحی سوالات تعیین سطح
- ذخیره نتیجه کاربر
- اتصال مسیر AI و Math به flow آموزشی واقعی
- اضافه کردن backend/API در صورت نیاز

### فاز deploy نهایی

- انتخاب hosting نهایی
- تنظیم domain
- فعال‌سازی SSL
- فعال‌سازی CDN و compression
- تست روی موبایل و لپ‌تاپ واقعی
- مانیتورینگ خطا و performance

## 13. جمله خلاصه برای معرفی

این نسخه یک لندینگ‌پیج مدرن فارسی برای شروع مسیر یادگیری هوش مصنوعی و ریاضی است. طراحی آن با React و Three.js ساخته شده، انیمیشن تعاملی دارد، روی GitHub آماده است و build/test کامل آن پاس شده. فعلاً فقط صفحه معرفی و انتخاب مسیر است و هنوز آزمون، پنل، دیتابیس یا backend ندارد. برای deploy، یک سرور سبک Node.js یا Cloudflare کافی است، اما چون جلوه‌های سه‌بعدی سمت مرورگر اجرا می‌شوند بهتر است کاربران دستگاه نسبتاً جدید با WebGL فعال داشته باشند.
