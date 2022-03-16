create database test
GO

use test
GO

CREATE TABLE [Personal_Fichadas]([id] [int] IDENTITY(1,1) NOT NULL, [idAgente] [int] NOT NULL,[fecha] [datetime] NOT NULL,[esEntrada] [bit] NULL,[reloj] [int] NOT NULL,[format] [int],	[data1] [int],	[data2] [int] )
GO
