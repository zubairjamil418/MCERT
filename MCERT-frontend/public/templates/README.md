# Template File Placement

## Important: Place Your Template Here

To use the MCLERTS document generation feature, you need to place your template file in this directory.

### Required Steps:

1. **Name your template file**: `mclerts-template.docx`
2. **Place it in this folder**: `public/templates/mclerts-template.docx`
3. **Ensure it's a valid .docx file** with the correct placeholders

### Template Requirements:

- **File name**: Must be exactly `mclerts-template.docx`
- **Format**: Microsoft Word .docx format
- **Placeholders**: Use the format `{placeholderName}` for text fields
- **Images**: Use the format `{aerialViewImage}` for the aerial view image

### Available Placeholders:

#### Text Fields:

- `{reportPreparedBy}` - Report preparer name
- `{inspector}` - Inspector name
- `{consentPermitHolder}` - Consent/Permit holder
- `{consentPermitNo}` - Consent/Permit number
- `{siteName}` - Site name
- `{siteContact}` - Site contact
- `{siteAddress}` - Site address
- `{siteRefPostcode}` - Site reference/postcode
- `{irishGridRef}` - Irish Grid reference
- `{flowmeterMakeModel}` - Flowmeter make/model
- `{flowmeterType}` - Flowmeter type
- `{flowmeterSerial}` - Flowmeter serial number
- `{niwAssetId}` - NIW Asset ID
- `{statementOfCompliance}` - Compliance statement
- `{uncertainty}` - Uncertainty value
- `{inspectionReportNo}` - Inspection report number
- `{dateOfInspection}` - Inspection date
- `{siteDescription}` - Site description
- `{flowmeterLocation}` - Flowmeter location
- `{currentDate}` - Current date (auto-generated)
- `{timestamp}` - Timestamp (auto-generated)

#### Image Fields:

- `{aerialViewImage}` - Aerial view image reference (shows filename or status)

### Example Template Structure:

```
MCLERTS SITE INSPECTION REPORT

Report Information:
Report Prepared By: {reportPreparedBy}
Inspector: {inspector}
Date: {currentDate}

Site Information:
Site Name: {siteName}
Site Address: {siteAddress}

Aerial View Image:
{aerialViewImage}

Flowmeter Details:
Make/Model: {flowmeterMakeModel}
Type: {flowmeterType}
Serial: {flowmeterSerial}

Generated on: {timestamp}
```

### Troubleshooting:

- **"Template file not found" error**: Ensure the file is named exactly `mclerts-template.docx` and placed in this directory
- **Images not showing**: The `{aerialViewImage}` placeholder will show the filename or status of the uploaded image
- **Placeholders not replaced**: Check that placeholder names match exactly (case-sensitive)

### Note:

The template file will be automatically loaded from this location each time a document is generated. No need to upload it each time - just place it here once and it will be used for all future reports.
