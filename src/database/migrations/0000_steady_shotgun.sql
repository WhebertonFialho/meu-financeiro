CREATE TABLE `categoria` (
	`codigo` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`descricao` text NOT NULL,
	`tipo` text NOT NULL,
	FOREIGN KEY (`tipo`) REFERENCES `tipo_categoria`(`codigo`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `lancamento` (
	`codigo` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tipo` integer NOT NULL,
	`categoria` integer NOT NULL,
	`data` text NOT NULL,
	`valor` real NOT NULL,
	`observacao` text,
	FOREIGN KEY (`tipo`) REFERENCES `tipo_lancamento`(`codigo`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`categoria`) REFERENCES `categoria`(`codigo`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `tipo_categoria` (
	`codigo` text PRIMARY KEY NOT NULL,
	`descricao` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tipo_categoria_codigo_unique` ON `tipo_categoria` (`codigo`);--> statement-breakpoint
CREATE TABLE `tipo_lancamento` (
	`codigo` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`descricao` text NOT NULL,
	`parcelado` integer DEFAULT false NOT NULL
);
