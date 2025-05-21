package com.yourcompany.teams;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.net.URL;
import java.nio.file.*;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class TeamsAppZipGenerator {

    /**
     * Generates a Microsoft Teams app ZIP file.
     *
     * @param baseUrl     The base HTTPS URL of the BI app (e.g., https://bi.example.com)
     * @param outputDir   Directory to place the output ZIP file
     * @throws IOException in case of file errors
     */
    public static void generateTeamsAppZip(String baseUrl, String outputDir) throws IOException {
        String appId = UUID.randomUUID().toString();

        // Create manifest
        JSONObject manifest = new JSONObject();
        manifest.put("$schema", "https://developer.microsoft.com/en-us/json-schemas/teams/v1.13/MicrosoftTeams.schema.json");
        manifest.put("manifestVersion", "1.13");
        manifest.put("version", "1.0.0");
        manifest.put("id", appId);
        manifest.put("packageName", "com.yourcompany.biteamsapp");

        JSONObject name = new JSONObject();
        name.put("short", "BI Teams App");
        name.put("full", "Business Intelligence Teams App");
        manifest.put("name", name);

        JSONObject description = new JSONObject();
        description.put("short", "BI app static tab");
        description.put("full", "Custom static tab pointing to BI dashboard");
        manifest.put("description", description);

        manifest.put("accentColor", "#FFFFFF");

        JSONObject icons = new JSONObject();
        icons.put("outline", "outline-icon.png");
        icons.put("color", "color-icon.png");
        manifest.put("icons", icons);

        JSONObject staticTab = new JSONObject();
        staticTab.put("entityId", "dashboard");
        staticTab.put("name", "Dashboard");
        staticTab.put("contentUrl", baseUrl + "/teams-dashboard");
        staticTab.put("scopes", new JSONArray().put("personal"));

        manifest.put("staticTabs", new JSONArray().put(staticTab));
        manifest.put("permissions", new JSONArray().put("identity"));
        manifest.put("validDomains", new JSONArray().put(new URL(baseUrl).getHost()));

        // Output paths
        Path output = Paths.get(outputDir);
        Files.createDirectories(output);

        Path manifestPath = output.resolve("manifest.json");
        Files.write(manifestPath, manifest.toString(2).getBytes());

        // Copy icons from resources
        copyResource("teams/icons/outline-icon.png", output.resolve("outline-icon.png"));
        copyResource("teams/icons/color-icon.png", output.resolve("color-icon.png"));

        // Create ZIP file
        Path zipPath = output.resolve("teams-app.zip");
        try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(zipPath))) {
            zipFile(zos, manifestPath, "manifest.json");
            zipFile(zos, output.resolve("outline-icon.png"), "outline-icon.png");
            zipFile(zos, output.resolve("color-icon.png"), "color-icon.png");
        }

        // Clean up individual files if needed
        Files.deleteIfExists(manifestPath);
        Files.deleteIfExists(output.resolve("outline-icon.png"));
        Files.deleteIfExists(output.resolve("color-icon.png"));

        System.out.println("Teams app ZIP created: " + zipPath);
    }

    private static void zipFile(ZipOutputStream zos, Path filePath, String entryName) throws IOException {
        try (InputStream fis = Files.newInputStream(filePath)) {
            zos.putNextEntry(new ZipEntry(entryName));
            byte[] buffer = new byte[1024];
            int length;
            while ((length = fis.read(buffer)) > 0) {
                zos.write(buffer, 0, length);
            }
            zos.closeEntry();
        }
    }

    private static void copyResource(String resourcePath, Path destination) throws IOException {
        try (InputStream in = TeamsAppZipGenerator.class.getClassLoader().getResourceAsStream(resourcePath)) {
            if (in == null) throw new FileNotFoundException("Resource not found: " + resourcePath);
            Files.copy(in, destination, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    // Example usage
    public static void main(String[] args) throws IOException {
        String baseUrl = "https://your-bi-app.com"; // Replace dynamically if needed
        String outputDir = "output";
        generateTeamsAppZip(baseUrl, outputDir);
    }
} 
