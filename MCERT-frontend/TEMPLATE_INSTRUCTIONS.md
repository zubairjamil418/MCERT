# MCLERTS Document Template Instructions

## Overview

This application uses docxtemplater to generate MCLERTS Site Inspection Reports from a template file. The template should be a `.docx` file with placeholders that will be replaced with form data.

## Template File Requirements

- File format: `.docx` (Microsoft Word document)
- File size: Less than 10MB
- Must contain placeholders in the format: `{placeholderName}`

## Available Placeholders

Use these placeholders in your template file to automatically populate the generated document:

### Basic Information

- `{reportPreparedBy}` - Name of person who prepared the report
- `{inspector}` - Name of the inspector
- `{currentDate}` - Current date (automatically generated)
- `{timestamp}` - Unique timestamp for document identification

### Consent/Permit Information

- `{consentPermitHolder}` - Consent/Permit holder name
- `{consentPermitNo}` - Consent/Permit number

### Site Information

- `{siteName}` - Name of the site
- `{siteContact}` - Site contact person
- `{siteAddress}` - Full site address
- `{siteRefPostcode}` - Site reference or postcode
- `{irishGridRef}` - Irish Grid reference for site entrance

### Flowmeter Information

- `{flowmeterMakeModel}` - Make and model of flowmeter(s)
- `{flowmeterType}` - Type of flowmeter(s)
- `{flowmeterSerial}` - Serial number(s) of flowmeter(s)
- `{niwAssetId}` - NIW Asset ID
- `{flowmeterLocation}` - Location description of flowmeter(s)

### Inspection Details

- `{inspectionReportNo}` - Inspection report number
- `{dateOfInspection}` - Date of inspection
- `{statementOfCompliance}` - Statement of compliance
- `{uncertainty}` - Uncertainty value

### Descriptions

- `{siteDescription}` - Site and flow meter description
- `{flowmeterLocation}` - Location of flowmeter(s)

### Image Fields

- `{aerialViewImage}` - Aerial view image reference (shows filename or status)

## Example Template Structure

Here's an example of how your template might look:

```
MCLERTS SITE INSPECTION REPORT

Report Information:
Report Prepared By: {reportPreparedBy}
Inspector: {inspector}
Date: {currentDate}
Report Number: {inspectionReportNo}

Site Information:
Site Name: {siteName}
Site Contact: {siteContact}
Site Address: {siteAddress}
Site Reference/Postcode: {siteRefPostcode}
Irish Grid Reference: {irishGridRef}

Aerial View Image:
{aerialViewImage}

Consent/Permit Details:
Consent/Permit Holder: {consentPermitHolder}
Consent/Permit Number: {consentPermitNo}

Flowmeter Information:
Make and Model: {flowmeterMakeModel}
Type: {flowmeterType}
Serial Number: {flowmeterSerial}
NIW Asset ID: {niwAssetId}

Inspection Details:
Date of Inspection: {dateOfInspection}
Statement of Compliance: {statementOfCompliance}
Uncertainty: {uncertainty}

Descriptions:
Site Description: {siteDescription}
Flowmeter Location: {flowmeterLocation}

Generated on: {timestamp}
```

## How to Use

1. Create your template file in Microsoft Word or any compatible word processor
2. Add placeholders using the format `{placeholderName}` where you want the form data to appear
3. **Save the file as**: `mclerts-template.docx`
4. **Place it in**: `public/templates/` folder of your project
5. Fill out the form with the required information
6. Submit the form to generate and download the completed document

**Note**: The template file is automatically loaded from the server. No need to upload it each time.

## Tips

- You can use the same placeholder multiple times in your template
- Placeholders are case-sensitive
- If a placeholder doesn't have corresponding data, it will be replaced with an empty string
- You can format the text around placeholders normally (bold, italic, etc.)
- The generated document will maintain all formatting from your template

## Troubleshooting

- **"Template file not found" error**: Ensure the file is named exactly `mclerts-template.docx` and placed in the `public/templates/` folder
- **Placeholders not replaced**: Check that placeholder names match exactly (case-sensitive)
- **Images not showing**: The `{aerialViewImage}` placeholder will show the filename or status of the uploaded image
- **Document generation fails**: Ensure your template file is not corrupted and is a valid Word document
