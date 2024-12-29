-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 22, 2024 at 11:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_commerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE `barang` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `terjual` int(11) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `harga` int(11) NOT NULL,
  `lokasi` varchar(255) DEFAULT 'Jakarta',
  `terjual` int(11) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT NULL,
  `diskon_percent` int(11) DEFAULT 0,
  `kategori` varchar(50) NOT NULL,
  `jumlah_rating` int(11) DEFAULT 0,
  `jumlah_perating` int(11) DEFAULT 0,
  `stok` int(11) DEFAULT 0,
  `kondisi` varchar(50) DEFAULT 'Baru',
  `min_pembelian` smallint(6) DEFAULT 1,
  `spesifikasi` varchar(255) DEFAULT NULL,
  `jumlah` int(11) DEFAULT 0,
  `checked` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `nama`, `harga`, `lokasi`, `terjual`, `rating`, `diskon_percent`, `kategori`, `jumlah_rating`, `jumlah_perating`, `stok`, `kondisi`, `min_pembelian`, `spesifikasi`, `jumlah`, `checked`) VALUES
(1, 'Samsung Galaxy S23', 12000000, 'Jakarta', 5245, 4.0, 0, '', 0, 0, 377, 'Baru', 1, NULL, 3, 1),
(2, 'iPhone 14', 14500000, 'Jakarta', 11023, 4.6, 0, '', 0, 0, 240, 'Baru', 1, NULL, 1, 1),
(5, 'Vivo V27', 6000000, 'Kota Surabaya', 924, 4.4, 0, '', 0, 0, 307, 'Baru', 1, NULL, 1, 1),
(6, 'Laptop MacBook Air M2', 16000000, 'Jakarta', 2021, 3.8, 0, '', 0, 0, 266, 'Baru', 1, NULL, 1, 1),
(7, 'Laptop Dell XPS 13', 18000000, 'Kota Banyumas', 2134, 4.2, 0, '', 0, 0, 209, 'Baru', 1, NULL, 1, 1),
(8, 'Laptop ASUS ROG Zephyrus G14', 20000000, 'Jakarta', 3543, 4.2, 0, '', 0, 0, 247, 'Baru', 1, NULL, 1, 1),
(9, 'Laptop Lenovo ThinkPad X1', 22000000, 'Kota Semarang', 5442, 4.1, 0, '', 0, 0, 211, 'Baru', 1, NULL, 1, 1),
(10, 'Tablet iPad Pro 12.9\"', 18500000, 'Jakarta', 212, 4.1, 0, '', 0, 0, 315, 'Baru', 1, NULL, 1, 1),
(14, 'Kamera Mirrorless Sony Alpha A7 IV', 30000000, 'Jakarta', 3241, 4.1, 0, '', 0, 0, 381, 'Baru', 1, NULL, 2, 1),
(15, 'Kamera GoPro Hero 11 Black', 7500000, 'Kota Bandung', 121, 4.3, 0, '', 0, 0, 328, 'Baru', 1, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `harga` int(11) NOT NULL,
  `lokasi` varchar(255) DEFAULT 'Jakarta',
  `terjual` int(11) DEFAULT 0,
  `rating` decimal(2,1) DEFAULT NULL,
  `diskon_percent` int(11) DEFAULT 0,
  `kategori` varchar(50) NOT NULL,
  `jumlah_rating` int(11) DEFAULT 0,
  `jumlah_perating` int(11) DEFAULT 0,
  `stok` int(11) DEFAULT 0,
  `kondisi` varchar(50) DEFAULT 'Baru',
  `min_pembelian` smallint(6) DEFAULT 1,
  `spesifikasi` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `nama`, `harga`, `lokasi`, `terjual`, `rating`, `diskon_percent`, `kategori`, `jumlah_rating`, `jumlah_perating`, `stok`, `kondisi`, `min_pembelian`, `spesifikasi`) VALUES
(1, 'Samsung Galaxy S23', 12000000, 'Jakarta', 5245, 4.0, 0, 'handphone', 1311, 327, 377, 'Baru', 1, 'Snapdragon 8 Gen 2, 6.1\" AMOLED 120Hz, 8GB RAM/128-256GB, 50MP + 12MP + 10MP cameras, 3900mAh battery'),
(2, 'iPhone 14', 14500000, 'Jakarta', 11023, 4.6, 0, 'handphone', 2756, 600, 240, 'Baru', 1, 'A15 Bionic, 6.1\" Super Retina XDR, 6GB RAM/128-512GB, 12MP + 12MP cameras, 3279mAh battery'),
(3, 'Xiaomi 13 Pro', 10000000, 'Jakarta', 100, 3.6, 0, 'handphone', 25, 7, 268, 'Baru', 1, 'Snapdragon 8 Gen 2, 6.73\" AMOLED 120Hz, 8-12GB RAM/128-512GB, 50.3MP + 50MP + 50MP cameras, 4820mAh battery'),
(4, 'OPPO Reno 8', 7500000, 'Kota Bandung', 12912, 4.1, 0, 'handphone', 3228, 789, 222, 'Baru', 1, 'MediaTek Dimensity 1300, 6.4\" AMOLED 90Hz, 8GB RAM/128-256GB, 50MP + 2MP + 2MP cameras, 4500mAh battery'),
(5, 'Vivo V27', 6000000, 'Kota Surabaya', 924, 4.4, 0, 'handphone', 231, 52, 307, 'Baru', 1, 'MediaTek Dimensity 7200, 6.78\" AMOLED 120Hz, 8-12GB RAM/256GB, 50MP + 8MP + 2MP cameras, 4600mAh battery'),
(6, 'Laptop MacBook Air M2', 16000000, 'Jakarta', 2021, 3.8, 0, 'laptop', 505, 133, 266, 'Baru', 1, 'Apple M2 Chip, 13.6\" Retina, 8-24GB RAM/256-512GB SSD, Up to 18 hours battery life'),
(7, 'Laptop Dell XPS 13', 18000000, 'Kota Banyumas', 2134, 4.2, 0, 'laptop', 534, 127, 209, 'Baru', 1, 'Intel Core i7, 13.4\" FHD+, 16GB RAM/512GB SSD, Up to 12 hours battery life'),
(8, 'Laptop ASUS ROG Zephyrus G14', 20000000, 'Jakarta', 3543, 4.2, 0, 'laptop', 886, 210, 247, 'Baru', 1, 'AMD Ryzen 9, 14\" QHD 120Hz, 16GB RAM/512GB-1TB SSD, 76Wh battery'),
(9, 'Laptop Lenovo ThinkPad X1', 22000000, 'Kota Semarang', 5442, 4.1, 0, 'laptop', 1361, 335, 211, 'Baru', 1, 'Intel Core i7, 14\" UHD+ Touch, 16GB RAM/512GB SSD, Up to 15 hours battery life'),
(10, 'Tablet iPad Pro 12.9\"', 18500000, 'Jakarta', 212, 4.1, 0, 'tablet', 53, 13, 315, 'Baru', 1, 'Apple M2 Chip, 12.9\" Liquid Retina XDR, 8-16GB RAM/128GB-2TB, 12MP + 10MP cameras, Up to 10 hours battery life'),
(11, 'Tablet Samsung Galaxy Tab S9', 14000000, 'Kota Yogyakarta', 1023, 4.0, 0, 'tablet', 256, 64, 339, 'Baru', 1, 'Snapdragon 8 Gen 2, 11\"/12.4\" AMOLED 120Hz, 8-12GB RAM/128-512GB, 13MP + 8MP cameras, 8400mAh battery'),
(12, 'Headphone Sony WH-1000XM5', 5500000, 'Jakarta', 3452, 4.0, 0, 'headphone', 863, 216, 348, 'Baru', 1, '30 hours playback, Active Noise Cancellation'),
(13, 'Earbuds Samsung Galaxy Buds 2 Pro', 3000000, 'Kota Semarang', 1212, 3.8, 0, 'earbuds', 303, 79, 325, 'Baru', 1, '18 hours playback, ANC, IPX7 water resistance'),
(14, 'Kamera Mirrorless Sony Alpha A7 IV', 30000000, 'Jakarta', 3241, 4.1, 0, 'kamera', 810, 200, 381, 'Baru', 1, '33MP full-frame camera, 4K video, 5-axis stabilization'),
(15, 'Kamera GoPro Hero 11 Black', 7500000, 'Kota Bandung', 121, 4.3, 0, 'kamera', 30, 7, 328, 'Baru', 1, '27MP camera, 5.3K video recording, Waterproof up to 33ft, 1720mAh battery'),
(16, 'Xiaomi Redmi Note 12', 3499000, 'Jakarta', 1231, 3.9, 0, 'handphone', 308, 79, 300, 'Baru', 1, 'Snapdragon 4 Gen 1, 6.67\" AMOLED 120Hz, 4-6GB RAM/64-128GB, 48MP + 8MP + 2MP cameras, 5000mAh battery'),
(17, 'Samsung Galaxy A14 5G', 2999000, 'Kota Semarang', 1287, 3.8, 0, 'handphone', 322, 85, 314, 'Baru', 1, 'Exynos 1330/Dimensity 700, 6.6\" PLS LCD 90Hz, 4-6GB RAM/64-128GB, 50MP + 2MP + 2MP cameras, 5000mAh battery'),
(18, 'Infinix Zero X Neo', 4499000, 'Kota Yogyakarta', 11132, 4.0, 0, 'handphone', 2783, 690, 270, 'Baru', 1, 'MediaTek Helio G95, 6.78\" IPS LCD 90Hz, 8GB RAM/128GB, 48MP + 8MP + 2MP cameras, 4500mAh battery'),
(19, 'Infinix Hot 30', 2199000, 'Jakarta', 1231, 4.2, 0, 'handphone', 308, 74, 207, 'Baru', 1, 'MediaTek Helio G88, 6.78\" IPS LCD 90Hz, 8GB RAM/128GB, 50MP + AI Lens cameras, 5000mAh battery'),
(20, 'Samsung Galaxy A04', 1899000, 'Kota Cirebon', 2321, 4.1, 0, 'handphone', 580, 140, 228, 'Baru', 1, 'Exynos 850, 6.5\" PLS LCD, 3-4GB RAM/32-128GB, 50MP + 2MP cameras, 5000mAh battery'),
(21, 'Realme Narzo 50A', 2699000, 'Jakarta', 8833, 3.9, 0, 'handphone', 2208, 559, 320, 'Baru', 1, 'MediaTek Helio G85, 6.5\" IPS LCD, 4-6GB RAM/64-128GB, 50MP + 2MP + 2MP cameras, 6000mAh battery'),
(22, 'Vivo Y11', 1599000, 'Kota Cirebon', 4902, 4.0, 0, 'handphone', 1226, 307, 314, 'Baru', 1, 'Snapdragon 439, 6.35\" IPS LCD, 3GB RAM/32GB, 13MP + 2MP cameras, 5000mAh battery');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `kata_kunci` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `kata_kunci`) VALUES
(23, 'jawa', '$2b$10$i/it8fPfPX47WLCM3YNVcuXfkPvuBCKsk8Vk/F0jSWnRIE4t0v0ua', '$2b$10$CPcZXHz9weCMrb2SpHZOeeQ9Uuap8rr7S9Y6l9T.WJ382Hn0NlqRi'),
(24, 'alldoo', '$2b$10$sCyD9johpGl79czgmiZ0n.rGynGq1urEsqCNRl3t3mzJkyFcgUZh2', '$2b$10$6pZzc/XJB8cDQdoOiUVcL.v4A9kNRPJr2citzwvzSKefb/O9PyJP2'),
(28, 'dodo', '$2b$10$nwqX0hLZaUm6Kj7fycOwuOWW2K//3qR9NqDP6xVZWNiAqjpm.Qi0C', '$2b$10$f.7OkzDakd.12BCjweDiPOTrjslSzMHYzPdi4j3AfrAtytkjkEU9C'),
(29, 'dodoezt', '$2b$10$5TLwNKTJeSfp84TshE6WPeruMPGofhR6keOfA6GsF3HulWzTv761K', '$2b$10$9m/.Xg/AOWgalkLEohe0dOxmFWDMo5PnpiRI6fFB3nE0p7V3D5zXu'),
(30, 'ddooo', '$2b$10$nd79nqeKlFfh9rT1cLS4R.qUJPC5wqIoPsBm0LYOP7j3eTX4Yfa.u', '$2b$10$wHIdnS9ffyx8lqWKKeRxOe6CwHaizIB7wqLAUBFrsEE9eiUlTyVB2'),
(31, 'ddooo0', '$2b$10$O4goM/3lHTu02SCtkEaFmuwi4QpGKmCglBE8hbJml3PeVyMzcUXN6', '$2b$10$WPulsHNJ8iihqMiEGrr4J.9INBw.FNkjPTlYW6L/sx7ohiIlhoMn2'),
(32, 'ALLDO', '$2b$10$NiwnrB4eNQWUduy7tEzTfeWhItjpAJx0oFvibpeTRHAH7s/gGlvB.', '$2b$10$MowfMU7lruVSj2pRMEpZHOqHnKTi8qiWnqeVEEsqP4xqYN2YZ38tu'),
(33, 'alokHijau', '$2b$10$Dkpndgdpq4ZVjwdqSzvweeCLYCcS9Sn4j2Lpb/i4J.J/Jd6FicstK', '$2b$10$7f5l/Lt8MZuKyBKjWej/lO7z66TwFfwuflR56t18sHuKR7O1/9qmC'),
(34, 'anjaygurinjay', '$2b$10$TfoFV2m/E6Q.pW1za1f1vOwO/jdlS.oZelRkV4NtLlOMERRURgMqW', '$2b$10$mQBlStZeuJEVICoofihKv.ROy3MK.fTXjJ0ShlHgMVrBBCKgHxwni'),
(36, 'miawaug', '$2b$10$GtLAU8lkkC7ztASPLuMqsuBozUlwK99YX0VK40IaxrpQUo.yZdFDu', '$2b$10$R68OH5uTDlBnjwV/UFyeNOEaEi4y2dtPc8gSbAiS/s6TXA92KkThy'),
(37, 'kicau', '$2b$10$m81hGI66OFynGLH423h8e.gBB7dzfLDBgCcUBGt6weVaLqIvtda.u', '$2b$10$IUIUsiJfWBaMgwciZiVK7u08ol0MPAb0Q9KgnO1Onsf7OhMtqYRfq'),
(38, 'kicauu', '$2b$10$DI/kjOoxEesLl0BB9e/t6e9I69ynWHMuI/2TN4rg0G3/v6arIa8.a', '$2b$10$p7x3l0BTbg6SzLMIMooI1u4fmZ1z0mZ4SntWyjPOQImBgISfhPVEq'),
(39, 'kicauua', '$2b$10$eDv69OoAf/Kq0wR8sjpDweQsb3ekpT34/tq2jvRWrRsYSGokKMaAG', '$2b$10$rZEAJ1Ii4ge1Zb44CtzFPOy0jcMmt5WEccXEcdEzImWfwmAm96RQK'),
(40, 'kicauuaa', '$2b$10$bFdoj8f.Y8FDuYAbmiUGzewRcX7kVH3t0f4UwgGDOf4b4NRsfnIgq', '$2b$10$ROFC4L9tlK6xnqDg9pljW.yrKxJuCx4QpECFwutsJ.HCR6m6.PDHm'),
(41, 'kicauuaaa', '$2b$10$4CiJ6Xn3ABUHHPbvSCK1geCcWlYItZYyY91IsH.ZNuTN/jBVAW8Ey', '$2b$10$fqw/ADuJdGWiPr0dcKIr.u6NNtxFuRk4K9eJaim5B9HzQml0PN7cO'),
(46, 'miaw', '$2b$10$7R5FqLyea5nqcU2tFkriMOUYVqPd8Wi/AHimu03jK9VupDNfBwbTO', '$2b$10$h682v2.G7gKczbeI0S.9w.0Ck2qvaTPgZrUgtUepg1XcG6iIi5//K'),
(49, 'hayabusa', '$2b$10$1xKNTdGq9clsPR1u8yOp9OJRpEDlHk6oPjnJcYho0d56QcM4J2FyW', '$2b$10$4MaXuM8mFUBBwhB2KAI7HeiRI37rp5BxUTfD7.riSjnO7GlDNs9WS');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama` (`nama`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barang`
--
ALTER TABLE `barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
