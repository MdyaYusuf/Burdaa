using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRollcallSystemAndAttendanceStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPresent",
                table: "RollcallEntries");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "EndTime",
                table: "Rollcalls",
                type: "interval",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartTime",
                table: "Rollcalls",
                type: "interval",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "RollcallEntries",
                type: "integer",
                nullable: false,
                defaultValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EndTime",
                table: "Rollcalls");

            migrationBuilder.DropColumn(
                name: "StartTime",
                table: "Rollcalls");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "RollcallEntries");

            migrationBuilder.AddColumn<bool>(
                name: "IsPresent",
                table: "RollcallEntries",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
