USE [master]
GO
/****** Object:  Database [Certify]    Script Date: 19/01/2025 23:23:44 ******/
CREATE DATABASE [Certify]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Certify', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Certify.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Certify_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Certify_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [Certify] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Certify].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Certify] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Certify] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Certify] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Certify] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Certify] SET ARITHABORT OFF 
GO
ALTER DATABASE [Certify] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Certify] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Certify] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Certify] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Certify] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Certify] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Certify] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Certify] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Certify] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Certify] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Certify] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Certify] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Certify] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Certify] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Certify] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Certify] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Certify] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Certify] SET RECOVERY FULL 
GO
ALTER DATABASE [Certify] SET  MULTI_USER 
GO
ALTER DATABASE [Certify] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Certify] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Certify] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Certify] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Certify] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Certify] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'Certify', N'ON'
GO
ALTER DATABASE [Certify] SET QUERY_STORE = ON
GO
ALTER DATABASE [Certify] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Certify]
GO
/****** Object:  UserDefinedFunction [dbo].[RemoveAcentos]    Script Date: 19/01/2025 23:23:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[RemoveAcentos] (@texto NVARCHAR(MAX))
RETURNS NVARCHAR(MAX)
AS
BEGIN
    DECLARE @resultado NVARCHAR(MAX);
    SET @resultado = @texto;

    SET @resultado = REPLACE(@resultado, 'á', 'a');
    SET @resultado = REPLACE(@resultado, 'é', 'e');
    SET @resultado = REPLACE(@resultado, 'í', 'i');
    SET @resultado = REPLACE(@resultado, 'ó', 'o');
    SET @resultado = REPLACE(@resultado, 'ú', 'u');
    SET @resultado = REPLACE(@resultado, 'à', 'a');
    SET @resultado = REPLACE(@resultado, 'è', 'e');
    SET @resultado = REPLACE(@resultado, 'ì', 'i');
    SET @resultado = REPLACE(@resultado, 'ò', 'o');
    SET @resultado = REPLACE(@resultado, 'ù', 'u');
    SET @resultado = REPLACE(@resultado, 'â', 'a');
    SET @resultado = REPLACE(@resultado, 'ê', 'e');
    SET @resultado = REPLACE(@resultado, 'î', 'i');
    SET @resultado = REPLACE(@resultado, 'ô', 'o');
    SET @resultado = REPLACE(@resultado, 'û', 'u');
    SET @resultado = REPLACE(@resultado, 'ã', 'a');
    SET @resultado = REPLACE(@resultado, 'õ', 'o');
    SET @resultado = REPLACE(@resultado, 'ä', 'a');
    SET @resultado = REPLACE(@resultado, 'ë', 'e');
    SET @resultado = REPLACE(@resultado, 'ï', 'i');
    SET @resultado = REPLACE(@resultado, 'ö', 'o');
    SET @resultado = REPLACE(@resultado, 'ü', 'u');
    SET @resultado = REPLACE(@resultado, 'ç', 'c');

    RETURN @resultado;
END;
GO
/****** Object:  Table [dbo].[UserProfile]    Script Date: 19/01/2025 23:23:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserProfile](
	[Id] [uniqueidentifier] NOT NULL,
	[Email] [nvarchar](256) NOT NULL,
	[PasswordHash] [nvarchar](100) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
	[Photo] [nvarchar](2048) NULL,
	[ConcurrencyStamp] [uniqueidentifier] NOT NULL,
	[SecurityStamp] [uniqueidentifier] NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[DeletedDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Event]    Script Date: 19/01/2025 23:23:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Event](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [varchar](256) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Photo] [nvarchar](2048) NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[EventTypeId] [uniqueidentifier] NULL,
	[Date] [date] NULL,
	[StartTime] [time](0) NULL,
	[EndTime] [time](0) NULL,
	[Pax] [int] NULL,
	[DeletedDate] [datetime] NULL,
	[CreatedDate] [datetime] NOT NULL,
	[TemplatePath] [varchar](255) NULL,
	[TemplateId] [uniqueidentifier] NULL,
	[EventTemplateId] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventTemplate]    Script Date: 19/01/2025 23:23:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventTemplate](
	[Id] [uniqueidentifier] NOT NULL,
	[Path] [varchar](255) NOT NULL,
	[PreviewPath] [varchar](255) NULL,
	[DeletedDate] [datetime] NULL,
	[CreatedDate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventType]    Script Date: 19/01/2025 23:23:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventType](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [varchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Guest]    Script Date: 19/01/2025 23:23:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Guest](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
	[Photo] [nvarchar](2048) NULL,
	[CheckinDate] [datetime] NULL,
	[EventId] [uniqueidentifier] NOT NULL,
	[GuestId] [uniqueidentifier] NULL,
	[Email] [varchar](255) NULL,
	[DeletedDate] [datetime] NULL,
	[CreatedDate] [datetime] NOT NULL,
	[GuestTypeId] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GuestType]    Script Date: 19/01/2025 23:23:44 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GuestType](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [varchar](50) NOT NULL
) ON [PRIMARY]
GO
INSERT [dbo].[EventType] ([Id], [Name]) VALUES (N'16274d81-8b61-404e-9154-463168f1cadd', N'Palestra')
INSERT [dbo].[EventType] ([Id], [Name]) VALUES (N'e30b4aa1-c5de-4eb9-95b7-4db92173b57b', N'Congresso')
INSERT [dbo].[EventType] ([Id], [Name]) VALUES (N'528880f7-a93a-4858-89e5-b5552b4fb40c', N'TCC')
INSERT [dbo].[EventType] ([Id], [Name]) VALUES (N'ef445b11-120f-40fd-9a1e-f0084373ef4f', N'Workshop')
GO
INSERT [dbo].[GuestType] ([Id], [Name]) VALUES (N'569708f0-5263-4c29-a884-8ec882084715', N'Aluno')
INSERT [dbo].[GuestType] ([Id], [Name]) VALUES (N'7b85b9a7-42ee-445b-be35-2be795e99220', N'Professor')
GO
INSERT [dbo].[UserProfile] ([Id], [Email], [PasswordHash], [Name], [Photo], [ConcurrencyStamp], [SecurityStamp], [CreatedDate], [DeletedDate]) VALUES (N'd4dda3c5-1293-4995-b33b-541ce873033f', N'teste@teste.com', N'QxojAnGBbNhYnw88sLB1VVohfYG50yjZL+sv/WJtv9Y=', N'Teste', N'https://randomuser.me/api/portraits/men/81.jpg', N'70b8ebc4-df11-447d-b62d-3399af48111d', N'383426de-9f51-453a-a88f-752fd8ff34e7', CAST(N'2025-01-18T14:01:53.897' AS DateTime), NULL)
GO
ALTER TABLE [dbo].[Event] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[EventTemplate] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Guest] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[UserProfile] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Event]  WITH CHECK ADD  CONSTRAINT [FK_Event_EventTemplate] FOREIGN KEY([EventTemplateId])
REFERENCES [dbo].[EventTemplate] ([Id])
GO
ALTER TABLE [dbo].[Event] CHECK CONSTRAINT [FK_Event_EventTemplate]
GO
ALTER TABLE [dbo].[Event]  WITH CHECK ADD  CONSTRAINT [FK_Event_Template] FOREIGN KEY([TemplateId])
REFERENCES [dbo].[EventTemplate] ([Id])
GO
ALTER TABLE [dbo].[Event] CHECK CONSTRAINT [FK_Event_Template]
GO
ALTER TABLE [dbo].[Event]  WITH CHECK ADD  CONSTRAINT [FK_Event_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[UserProfile] ([Id])
GO
ALTER TABLE [dbo].[Event] CHECK CONSTRAINT [FK_Event_User]
GO
ALTER TABLE [dbo].[Guest]  WITH CHECK ADD  CONSTRAINT [FK_Guest_Event] FOREIGN KEY([EventId])
REFERENCES [dbo].[Event] ([Id])
GO
ALTER TABLE [dbo].[Guest] CHECK CONSTRAINT [FK_Guest_Event]
GO
ALTER TABLE [dbo].[Guest]  WITH CHECK ADD  CONSTRAINT [FK_Guest_Guest] FOREIGN KEY([GuestId])
REFERENCES [dbo].[Guest] ([Id])
GO
ALTER TABLE [dbo].[Guest] CHECK CONSTRAINT [FK_Guest_Guest]
GO
USE [master]
GO
ALTER DATABASE [Certify] SET  READ_WRITE 
GO
