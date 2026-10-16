ALTER TABLE `categories`
  ADD COLUMN `parent_id` int(11) DEFAULT NULL AFTER `image_url`,
  ADD KEY `parent_id` (`parent_id`),
  ADD CONSTRAINT `categories_ibfk_parent`
    FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
