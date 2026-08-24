-- =============================================
-- Sample Data for E-Commerce Database (ชุดข้อมูลใหม่)
-- 6 categories / 40 products / 12 customers / 12 orders (ภาษาไทย 100%)
-- รองรับภาษาไทยเต็มรูปแบบ utf8mb4_unicode_ci
-- วิธีนำเข้า: mysql --default-character-set=utf8mb4 -u app_user -p ecommerce < insert_data_ecom_example_50_products.sql
-- ไฟล์นี้เป็น UTF-8 (ไม่มี BOM) และรันซ้ำได้แบบ idempotent
-- =============================================

-- =============================================
-- STEP 1: ตั้งค่าการเชื่อมต่อให้รองรับภาษาไทย utf8mb4
-- (รันด้วย client UTF-8: mysql --default-character-set=utf8mb4)
-- =============================================
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;
SET CHARACTER_SET_CLIENT = utf8mb4;
SET CHARACTER_SET_CONNECTION = utf8mb4;
SET CHARACTER_SET_RESULTS = utf8mb4;
SET collation_connection = 'utf8mb4_unicode_ci';
SET time_zone = '+07:00';

-- =============================================
-- STEP 2: บังคับให้ทุกตารางรองรับภาษาไทย
-- แม้ถูกสร้างมาก่อนโดยไม่มี utf8mb4 (รันซ้ำได้ ไม่กระทบข้อมูลถ้าเป็น utf8mb4 อยู่แล้ว)
-- =============================================
ALTER TABLE `categories` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `products` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `product_images` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `customers` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `orders` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `order_items` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- STEP 3: ล้างข้อมูลตารางทั้งหมด เพื่อให้รันซ้ำได้
-- (TRUNCATE เร็วกว่า DELETE และรีเซ็ต AUTO_INCREMENT อัตโนมัติ)
-- ถ้าไม่ต้องการลบข้อมูลเดิม ให้คอมเมนต์บล็อกนี้ออก
-- =============================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `product_images`;
TRUNCATE TABLE `products`;
TRUNCATE TABLE `categories`;
TRUNCATE TABLE `customers`;
SET FOREIGN_KEY_CHECKS = 1;

-- รีเซ็ต AUTO_INCREMENT ให้เริ่มที่ 1 หลัง TRUNCATE (บางเวอร์ชัน TRUNCATE ไม่รีเซ็ตเมื่อปิด FK check)
ALTER TABLE `categories` AUTO_INCREMENT = 1;
ALTER TABLE `products` AUTO_INCREMENT = 1;
ALTER TABLE `product_images` AUTO_INCREMENT = 1;
ALTER TABLE `customers` AUTO_INCREMENT = 1;
ALTER TABLE `orders` AUTO_INCREMENT = 1;
ALTER TABLE `order_items` AUTO_INCREMENT = 1;

-- =============================================
-- 1. categories (6 หมวดหมู่ - ภาษาไทย)
-- ใช้ id แบบระบุชัดเจนเพื่อให้ products/order_items อ้างอิงได้ตรงแม้รันซ้ำ
-- =============================================
INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'โทรศัพท์มือถือ'),
(2, 'คอมพิวเตอร์และอุปกรณ์'),
(3, 'เครื่องเสียง'),
(4, 'กล้องและโดรน'),
(5, 'เครื่องใช้ไฟฟ้าภายในบ้าน'),
(6, 'สุขภาพและฟิตเนส');

-- =============================================
-- 2. products (40 rows - ชุดข้อมูลใหม่ + เพิ่มเติม)
-- description เป็นภาษาไทย 100% ละเอียด เพื่อรองรับการค้นหาภาษาไทย
-- (LIKE '%มือถือ%' / '%คอมพิวเตอร์%' / '%เครื่องเสียง%' / '%กล้อง%' ฯลฯ)
-- ชื่อสินค้าคงแบรนด์สากลเพื่อให้ค้นหาได้ทั้งไทย-อังกฤษ
-- =============================================
INSERT INTO `products` (`id`, `name`, `description`, `price`, `category_id`) VALUES
-- Mobile phones: id 1-4 (หมวดโทรศัพท์มือถือ)
(1, 'iPhone 17 Pro Max', 'สมาร์ทโฟนเรือธง Apple จอ Super Retina XDR 6.9 นิ้ว 120Hz ชิป A19 Pro กล้องหลัง 48MP สามตัว ตัวเครื่องอะลูมิเนียมยูนิบอดี้ กันน้ำ IP68 รองรับ Apple Intelligence', 56900.00, 1),
(2, 'Samsung Galaxy Z Flip7', 'สมาร์ทโฟนพับได้ จอ FlexWindow AMOLED 6.9 นิ้ว พับเก็บกะทัดรัด ชิป Snapdragon 8 Elite For Galaxy รองรับ Galaxy AI แปลภาษาเรียลไทม์ แบต 4300mAh', 44900.00, 1),
(3, 'Xiaomi 15T Pro', 'สมาร์ทโฟนคุ้มราคาสายพรีเมียม จอ AMOLED 6.83 นิ้ว 144Hz กล้อง Leica เลนส์เทเลโฟโต้ ซูม 5 เท่า ชิป Dimensity 9400+ ชาร์จเร็ว 90W', 21990.00, 1),
(4, 'OPPO Reno14', 'สมาร์ทโฟนสายถ่ายภาพและพอร์ตเทรต AI Eraser ลบสิ่งรบกวนในภาพ จอ AMOLED 120Hz กันน้ำ IP65 แบต 6000mAh ชาร์จไว 80W', 18999.00, 1),

-- Computers: id 5-8 (หมวดคอมพิวเตอร์และอุปกรณ์)
(5, 'MacBook Pro M4 14', 'แล็ปท็อปเรือธงสำหรับมืออาชีพ จอ Liquid Retina XDR 14 นิ้ว 1000 nits ชิป M4 RAM 16GB SSD 512GB แบต 24 ชม. พอร์ต HDMI SD Card Thunderbolt 4', 79900.00, 2),
(6, 'Lenovo Legion Slim 5', 'แล็ปท็อปเกมมิ่งบางเบา จอ OLED 2.8K 165Hz ชิป AMD Ryzen 7 8845HS การ์ดจอ RTX 4070 RAM 32GB SSD 1TB เหมาะทั้งเล่นเกมและทำงาน', 52990.00, 2),
(7, 'ASUS ROG Zephyrus G16', 'แล็ปท็อปเกมมิ่งดีไซน์พรีเมียม จอ Nebula 2.5K 240Hz ชิป Intel Core Ultra 9 การ์ดจอ RTX 4080 ระบบระบายความร้อน Tri-Fan เสียงเงียบ', 69990.00, 2),
(8, 'Acer Nitro V15', 'แล็ปท็อปเกมมิ่งราคาประหยัด จอ IPS 144Hz ชิป Intel Core i5-13420H การ์ดจอ RTX 4050 RAM 16GB SSD 512GB เหมาะนักศึกษาและมือใหม่', 26990.00, 2),

-- Audio: id 9-12 (หมวดเครื่องเสียง)
(9, 'Sony WH-1000XM6', 'หูฟังครอบหูไร้สาย ตัดเสียงรบกวน ANC รุ่นใหม่ล่าสุด ชิป QN3 ประมวลผลเสียงเร็วขึ้น แบต 30 ชม. พับเก็บได้อีกครั้ง เสียง LDAC Hi-Res', 16900.00, 3),
(10, 'Marshall Acton IV', 'ลำโพงบลูทูธดีไซน์คลาสสิก เสียง Signature Sound สมดุล คุมเสียงผ่านปุ่มหมุนอะนาล็อก แบตใช้กับสายไฟ รองรับ Bluetooth 5.3 หลายเครื่อง', 15900.00, 3),
(11, 'JBL Charge 5', 'ลำโพงบลูทูธพกพา เสียง JBL Pro Sound กันน้ำ IP67 แบต 20 ชม. ชาร์จมือถือจากลำโพงได้ เชื่อมคู่ PartyBoost เพิ่มความดัง', 5490.00, 3),
(12, 'Beats Studio Buds+', 'หูฟัง True Wireless ANC 42dB เสียงเบสแน่นแบบ Beats ใช้กับทั้ง iOS และ Android แบต 9 ชม. ไมค์โทรชัด น้ำหนักเบา', 6290.00, 3),

-- Cameras & drones: id 13-16 (หมวดกล้องและโดรน)
(13, 'Canon EOS R10', 'กล้องมิเรอร์เลส APS-C 24.2MP ถ่ายต่อเนื่อง 23 fps วิดีโอ 4K60p AF Dual Pixel CMOS II จับตาแม่นยำ ตัวเล็กเบา พร้อมเลนส์ Kit', 42900.00, 4),
(14, 'DJI Mini 4 Pro', 'โดรนน้ำหนักเบา 249 กรัม ถ่ายวิดีโอ 4K HDR Vertical Shooting สำหรับ Reels Omni Obstacle Sensing หลบสิ่งกีดขวางทุกทิศ บิน 34 นาที', 34900.00, 4),
(15, 'GoPro HERO12 Black', 'กล้องแอคชั่น 5.3K60fps HDR กันน้ำเอง 10 เมตร HyperSmooth 6.0 กันสั่นระดับโปร โหมด Max Lens มุมกว้าง 177 องศา', 15900.00, 4),
(16, 'Sony Alpha ZV-E10 II', 'กล้อง Vlog เลนส์เปลี่ยนได้ เซ็นเซอร์ APS-C 26MP วิดีโอ 4K 120fps จอพลิกหันมา ไมค์สามทิศทาง โหมด Product Showcase สำหรับรีวิวสินค้า', 45900.00, 4),

-- Home appliances: id 17-21 (หมวดเครื่องใช้ไฟฟ้าภายในบ้าน)
(17, 'Samsung Bespoke Refrigerator', 'ตู้เย็นบานประตูเปลี่ยนสีได้ ความจุ 20 ลูกบาศก์ฟุต Twin Cooling Plus คุมความชื้น เปิด-ปิดอัตโนมัติ ประหยัดไฟระดับ 5 ดาว', 32900.00, 5),
(18, 'LG Air Conditioner 12000BTU', 'แอร์อินเวอร์เตอร์ 12000 BTU ประหยัดไฟ 60% ฟิล์ม DUALCOOL ฆ่าเชื้อ ลด PM2.5 ควบคุมผ่าน ThinQ Wi-Fi เสียงเงียบเพียง 19 dB(A)', 24900.00, 5),
(19, 'Philips Air Fryer XXL', 'หม้อทอดไร้น้ำมัน ความจุ 7.3 ลิตร ทอดไก่ทั้งตัวได้ เทคโนโลยี Rapid Air ลดไขมันถึง 90% ล้างจานในเครื่องได้ ประกัน 2 ปี', 8990.00, 5),
(20, 'Dyson V12 Detect Slim', 'เครื่องดูดฝุ่นไร้สายน้ำหนักเบา แรงดูด 150AW เลเซอร์ตรวจจับฝุ่นขนาดเล็ก จอ LCD แสดงขนาดฝุ่นเรียลไทม์ HEPA กรองฝุ่น PM0.1', 22900.00, 5),
(21, 'Xiaomi Robot Vacuum S20+', 'หุ่นยนต์ดูดฝุ่นและถูพื้น แรงดูด 6000Pa สร้างแผนที่ LDS อัจฉริยะ กำหนดเขตห้ามล้างผ่านแอป ถังน้ำ 300ml แบต 3200mAh', 14990.00, 5),

-- Health & fitness: id 22-25 (หมวดสุขภาพและฟิตเนส)
(22, 'Apple Watch Ultra 2', 'สมาร์ทวอทช์ระดับโปร จอ Retina 3000 nits สว่างที่สุด ตัวเรือนไทเทเนียม กันน้ำ 100 เมตร GPS ความแม่นยำสองความถี่ Action Button ปุ่มกำหนดเอง', 36900.00, 6),
(23, 'Fitbit Charge 6', 'สายรัดข้อมือสุขภาพ วัดอัตราการเต้นหัวใจแบบต่อเนื่อง SpO2 คะแนน Daily Readiness รองรับ Google Maps และ Wallet แบต 7 วัน', 5390.00, 6),
(24, 'Garmin Instinct 3', 'สมาร์ทวอทช์กลางแจ้งทนทาน MIL-STD 810 จอ AMOLED หรือ Solar วัดออกซิเจนในเลือด GPS Multi-Band แบตถึง 40 วัน เหมาะเดินป่า', 13900.00, 6),
(25, 'Xiaomi Smart Band 10', 'สายรัดข้อมือราคาประหยัด จอ AMOLED 1.62 นิ้ว 1500 nits 150+ โหมดกีฬา วัดอัตราการเต้นหัวใจ SpO2 และการนอน แบต 21 วัน', 1990.00, 6),

-- Mobile phones (เพิ่มเติม): id 26-28 (หมวดโทรศัพท์มือถือ)
(26, 'Google Pixel 10', 'สมาร์ทโฟน Android จาก Google กล้อง Triple Rear ถ่ายภาพคมชัดด้วย AI Gemini ผู้ช่วยอัจฉริยะในเครื่อง อัปเดต OS ยาว 7 ปี Tensor G4 กันน้ำ IP68', 39900.00, 1),
(27, 'vivo V60', 'สมาร์ทโฟนสายพอร์ตเทรต เลนส์ ZEISS AURA จอ AMOLED โค้ง 6.77 นิ้ว 120Hz แบต 6500mAh อึดทั้งวัน ชาร์จไว 90W น้ำหนักเบา', 14999.00, 1),
(28, 'realme GT7', 'สมาร์ทโฟนเกมมิ่งสเปกจัดเต็ม จอ AMOLED 6.78 นิ้ว 120Hz ชิป Dimensity 9400e ระบบระบายความร้อน IceSense Graphite แบต 7000mAh ชาร์จ 120W', 16990.00, 1),

-- Computers (เพิ่มเติม): id 29-31 (หมวดคอมพิวเตอร์และอุปกรณ์)
(29, 'Microsoft Surface Laptop 7', 'แล็ปท็อป Copilot+ PC ดีไซน์บางเฉียบ จอ PixelSense Flow สัมผัส 13.8 นิ้ว 120Hz ชิป Snapdragon X Plus แบต 20 ชม. เงียบไม่มีพัดลม', 49900.00, 2),
(30, 'HP Victus 16', 'แล็ปท็อปเกมมิ่งจอใหญ่ 16.1 นิ้ว 144Hz ชิป Intel Core i7-13620H การ์ดจอ RTX 4060 RAM 16GB SSD 512GB คีย์บอร์ดไฟ RGB ราคาคุ้มค่า', 34990.00, 2),
(31, 'ASUS Vivobook 15', 'แล็ปท็อปอเนกประสงค์ราคาประหยัด จอ IPS 15.6 นิ้ว Full HD ชิป Intel Core i5-1335U RAM 16GB SSD 512GB น้ำหนัก 1.7 กก. เหมาะเรียน-ทำงาน', 19990.00, 2),

-- Audio (เพิ่มเติม): id 32-33 (หมวดเครื่องเสียง)
(32, 'Anker Soundcore Space One Pro', 'หูฟังพับได้กระชับ ANC 4 เท่า โหมด Adaptive ปรับตามสภาพแวดล้อม เสียง Hi-Res LDAC แบต 40 ชม. เคสพับเล็กพกง่าย', 4490.00, 3),
(33, 'Sony SRS-XG300', 'ลำโพงบลูทูธ X-Series เสียงใหญ่แน่น เบส MEGA BASS กันน้ำ IP67 แบต 25 ชม. ไฟ LED รอบตัว เชื่อม Party Connect ได้ถึง 100 ลำโพง', 6990.00, 3),

-- Cameras & drones (เพิ่มเติม): id 34-35 (หมวดกล้องและโดรน)
(34, 'Nikon Z50 II', 'กล้องมิเรอร์เลส APS-C 20.9MP AF Expeed 7 จับวัตถุ 9 ประเภท ถ่ายต่อเนื่อง 11 fps วิดีโอ 4K60p จอพลิกหันมา Vlog ได้ เหมาะมือใหม่ถึงกลาง', 45900.00, 4),
(35, 'DJI Neo', 'โดรนขนาดจิ๋ว 135 กรัม บินขึ้นจากฝ่ามือได้ Palm Takeoff ถ่าย 4K30p AI ติดตามตัวอัตโนมัติ กันน้ำระดับ 4 ใช้ง่ายสำหรับมือใหม่', 8490.00, 4),

-- Home appliances (เพิ่มเติม): id 36-37 (หมวดเครื่องใช้ไฟฟ้าภายในบ้าน)
(36, 'Sharp Washing Machine 8kg', 'เครื่องซักผ้าฝากบน 8 กก. เทคโนโลยี Plasmacluster Ion ฆ่าเชื้อโรคและกลิ่นอับ ถัง No-Hole สะอาดปลอดเชื้อรา ประหยัดไฟ ประกัน 3 ปี', 12900.00, 5),
(37, 'Panasonic Rice Cooker 1.8L', 'หม้อหุงข้าว 1.8 ลิตร หุงได้ 10 คน โปรแกรมหุงข้าว 12 เมนู รวมข้าวกล้องและข้าวเหนียว ด้านในเคลือบ Diamond Coating ทนทานไม่ติด', 2790.00, 5),

-- Health & fitness (เพิ่มเติม): id 38-40 (หมวดสุขภาพและฟิตเนส)
(38, 'HUAWEI WATCH GT 6', 'สมาร์ทวอทช์ดีไซน์วงแหวนโลหะ จอ AMOLED 1.43 นิ้ว แบต 21 วัน Health Glance ตรวจสุขภาพครบในจอเดียว 100+ โหมดออกกำลังกาย กันน้ำ 5 ATM', 10900.00, 6),
(39, 'Amazfit T-Rex 3', 'สมาร์ทวอทช์ผจญภัยทนทาน MIL-STD 810G กันน้ำ 10 ATM จอ AMOLED 1.5 นิ้ว แบต 27 วัน GPS Dual-Band แผนที่ Offline เหมาะเที่ยวป่า-ดำน้ำ', 8990.00, 6),
(40, 'Xiaomi Massage Gun Mini', 'ปืนนวดขนาดมินิพกพา แรงสั่น 3200 rpm 4 ระดับความเร็ว หัวนวด 4 ชนิด ลดอาการเมื่อยล้ากล้ามเนื้อ เงียบต่ำกว่า 45dB แบต 10 ชม.', 2490.00, 6);

-- =============================================
-- 3. product_images - mapping รูปสินค้า (id 1 และ 5 มีหลายรูปเพื่อสอน Gallery)
-- =============================================
INSERT INTO `product_images` (`product_id`, `image_name`) VALUES
(1, 'iphone-17-pro-max-front.jpg'),
(1, 'iphone-17-pro-max-back.jpg'),
(2, 'galaxy-z-flip7-open.jpg'),
(3, 'xiaomi-15t-pro-front.jpg'),
(4, 'oppo-reno14-front.jpg'),
(5, 'macbook-pro-m4-14-front.jpg'),
(5, 'macbook-pro-m4-14-open.jpg'),
(6, 'legion-slim-5-front.jpg'),
(7, 'rog-zephyrus-g16-front.jpg'),
(8, 'acer-nitro-v15-front.jpg'),
(9, 'sony-wh1000xm6-front.jpg'),
(10, 'marshall-acton-iv-front.jpg'),
(11, 'jbl-charge-5-front.jpg'),
(12, 'beats-studio-buds-plus-front.jpg'),
(13, 'canon-eos-r10-front.jpg'),
(14, 'dji-mini-4-pro-front.jpg'),
(15, 'gopro-hero12-black-front.jpg'),
(16, 'sony-zv-e10-ii-front.jpg'),
(17, 'samsung-bespoke-fridge-front.jpg'),
(18, 'lg-ac-12000btu-front.jpg'),
(19, 'philips-air-fryer-xxl-front.jpg'),
(20, 'dyson-v12-detect-slim-front.jpg'),
(21, 'xiaomi-robot-vacuum-s20-plus-front.jpg'),
(22, 'apple-watch-ultra-2-front.jpg'),
(23, 'fitbit-charge-6-front.jpg'),
(24, 'garmin-instinct-3-front.jpg'),
(25, 'xiaomi-smart-band-10-front.jpg'),
(26, 'google-pixel-10-front.jpg'),
(27, 'vivo-v60-front.jpg'),
(28, 'realme-gt7-front.jpg'),
(29, 'surface-laptop-7-front.jpg'),
(30, 'hp-victus-16-front.jpg'),
(31, 'asus-vivobook-15-front.jpg'),
(32, 'soundcore-space-one-pro-front.jpg'),
(33, 'sony-srs-xg300-front.jpg'),
(34, 'nikon-z50-ii-front.jpg'),
(35, 'dji-neo-front.jpg'),
(36, 'sharp-washing-machine-8kg-front.jpg'),
(37, 'panasonic-rice-cooker-18l-front.jpg'),
(38, 'huawei-watch-gt-6-front.jpg'),
(39, 'amazfit-t-rex-3-front.jpg'),
(40, 'xiaomi-massage-gun-mini-front.jpg');

-- =============================================
-- 4. customers (12 ราย - ภาษาไทย 100%)
-- ที่อยู่ใช้รูปแบบไทยมาตรฐาน: บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์
-- =============================================
INSERT INTO `customers` (`id`, `name`, `address`, `phone`) VALUES
(1, 'ประเสริฐ เจริญสุข', '88/12 ซ.รามอินทรา 39 แขวงบึงกุ่ม เขตบึงกุ่ม กรุงเทพฯ 10240', '086-111-2345'),
(2, 'มาลี ศรีทอง', '45/2 ถ.ติวานนท์ ต.บางเขน อ.เมือง จ.นนทบุรี 11000', '087-222-3456'),
(3, 'กิตติ พัฒนกิจ', '67 ถ.สุขุมวิท ต.เสม็ด อ.เมือง จ.ชลบุรี 20000', '091-333-4567'),
(4, 'อรพรรณ มีสุข', '9/4 ถ.มิตรภาพ ต.ในเมือง อ.เมือง จ.ขอนแก่น 40000', '092-444-5678'),
(5, 'ธนกฤต แสนสุข', '120 ถ.ห้วยแก้ว ต.สุเทพ อ.เมือง จ.เชียงใหม่ 50200', '093-555-6789'),
(6, 'พรทิพย์ อยู่ดี', '55 ถ.เพชรเกษม แขวงบางยี่ขัน เขตบางพลัด กรุงเทพฯ 10700', '094-666-7890'),
(7, 'สุรเดช วงศ์ดี', '23 ม.2 ต.คลองหนึ่ง อ.คลองหลวง จ.ปทุมธานี 12120', '095-777-8901'),
(8, 'จิรายุ ทับทิม', '301 ถ.เลี่ยงเมือง ต.ปากน้ำ อ.เมือง จ.กระบี่ 81000', '096-888-9012'),
(9, 'วรรณา บุญมี', '14/3 ถ.สิงห์ศรี ต.บางพูด อ.เมือง จ.สิงห์บุรี 16000', '097-999-0123'),
(10, 'ชาตรี นครินทร์', '77 ถ.ลาดพร้าว แขวงจรเข้บัว เขตลาดพร้าว กรุงเทพฯ 10230', '081-010-1234'),
(11, 'กมลชนก แก้วใส', '210 ถ.ถนนเมือง ต.ในเวียง อ.เมือง จ.แพร่ 54000', '082-020-2345'),
(12, 'อิทธิพัทธ์ รุ่งเรือง', '65 ถ.เทศบาล 2 ต.บางประกง อ.เมือง จ.ฉะเชิงเทรา 24000', '083-030-3456');

-- =============================================
-- 5. orders (12 ออเดอร์ ครบทุกสถานะ delivered/received/processing)
-- =============================================
INSERT INTO `orders` (`id`, `date`, `customer_id`, `status`, `total_amount`) VALUES
(1, '2026-07-01 09:30:00', 1, 'delivered',   63190.00),
(2, '2026-07-02 14:15:00', 2, 'delivered',   79900.00),
(3, '2026-07-03 10:00:00', 3, 'processing',  22390.00),
(4, '2026-07-05 16:45:00', 4, 'received',    50800.00),
(5, '2026-07-08 08:20:00', 5, 'processing',  31890.00),
(6, '2026-07-10 11:00:00', 6, 'delivered',   40880.00),
(7, '2026-07-12 15:30:00', 7, 'received',    69990.00),
(8, '2026-07-15 09:00:00', 8, 'processing',  39890.00),
(9, '2026-07-18 13:20:00', 9, 'delivered',   44390.00),
(10, '2026-07-20 10:10:00', 10, 'processing', 37480.00),
(11, '2026-07-22 17:40:00', 11, 'received',   54390.00),
(12, '2026-07-25 09:50:00', 12, 'delivered',  27470.00);

-- =============================================
-- 6. order_items - total_amount ตรงกับผลรวม quantity*price ทุกออเดอร์
-- =============================================
INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `price`) VALUES
-- Order #1: ประเสริฐ → iPhone 17 Pro Max x1 + Beats Studio Buds+ x1 = 63,190 (id 1,12)
(1, 1, 1, 56900.00),
(1, 12, 1, 6290.00),
-- Order #2: มาลี → MacBook Pro M4 14 x1 = 79,900 (id 5)
(2, 5, 1, 79900.00),
-- Order #3: กิตติ → Sony WH-1000XM6 x1 + JBL Charge 5 x1 = 22,390 (id 9,11)
(3, 9, 1, 16900.00),
(3, 11, 1, 5490.00),
-- Order #4: อรพรรณ → DJI Mini 4 Pro x1 + GoPro HERO12 Black x1 = 50,800 (id 14,15)
(4, 14, 1, 34900.00),
(4, 15, 1, 15900.00),
-- Order #5: ธนกฤต → Dyson V12 Detect Slim x1 + Philips Air Fryer XXL x1 = 31,890 (id 20,19)
(5, 20, 1, 22900.00),
(5, 19, 1, 8990.00),
-- Order #6: พรทิพย์ → Apple Watch Ultra 2 x1 + Xiaomi Smart Band 10 x2 = 40,880 (id 22,25)
(6, 22, 1, 36900.00),
(6, 25, 2, 1990.00),
-- Order #7: สุรเดช → ASUS ROG Zephyrus G16 x1 = 69,990 (id 7)
(7, 7, 1, 69990.00),
-- Order #8: จิรายุ → LG Air Conditioner x1 + Xiaomi Robot Vacuum S20+ x1 = 39,890 (id 18,21)
(8, 18, 1, 24900.00),
(8, 21, 1, 14990.00),
-- Order #9: วรรณา → Google Pixel 10 x1 + Soundcore Space One Pro x1 = 44,390 (id 26,32)
(9, 26, 1, 39900.00),
(9, 32, 1, 4490.00),
-- Order #10: ชาตรี → HP Victus 16 x1 + Xiaomi Massage Gun Mini x1 = 37,480 (id 30,40)
(10, 30, 1, 34990.00),
(10, 40, 1, 2490.00),
-- Order #11: กมลชนก → Nikon Z50 II x1 + DJI Neo x1 = 54,390 (id 34,35)
(11, 34, 1, 45900.00),
(11, 35, 1, 8490.00),
-- Order #12: อิทธิพัทธ์ → Sharp Washing Machine x1 + Panasonic Rice Cooker x2 + Amazfit T-Rex 3 x1 = 27,470 (id 36,37,39)
(12, 36, 1, 12900.00),
(12, 37, 2, 2790.00),
(12, 39, 1, 8990.00);

-- =============================================
-- ตรวจสอบภาษาไทย (รันทดสอบหลัง import)
-- ต้องเห็นภาษาไทยถูกต้อง ไม่เป็น ??? หรือ à¸ªà¸¡
-- =============================================
-- SELECT 'ทดสอบภาษาไทย' AS test_thai;
-- SELECT id, name, description FROM products WHERE description LIKE '%สมาร์ทโฟน%' LIMIT 5;
-- SELECT id, name, description FROM products WHERE description LIKE '%คอมพิวเตอร์%' LIMIT 5;
-- SELECT id, name, description FROM products WHERE description LIKE '%เครื่องเสียง%' LIMIT 5;
-- SELECT id, name, description FROM products WHERE description LIKE '%กล้อง%' OR description LIKE '%โดรน%' LIMIT 5;
-- SELECT id, name, description FROM products WHERE category_id = 5 AND (description LIKE '%ประหยัดไฟ%' OR description LIKE '%ไร้สาย%');
-- SELECT id, name, address FROM customers WHERE address LIKE '%กรุงเทพ%' OR address LIKE '%เชียงใหม่%';
-- SELECT c.name AS หมวดหมู่, COUNT(p.id) AS จำนวนสินค้า FROM categories c LEFT JOIN products p ON p.category_id=c.id GROUP BY c.id;
-- SHOW VARIABLES LIKE 'character_set%';
-- SHOW VARIABLES LIKE 'collation%';
-- SHOW FULL COLUMNS FROM products WHERE Field IN ('name','description');
-- SHOW FULL COLUMNS FROM customers WHERE Field IN ('name','address');
