$content = Get-Content -Raw -Path "downloads/index.js" -Encoding utf8
$parts = $content.Split('\"')

$courseKeywords = @("AI Agents", "Multi Cloud", "Multi-Cloud", "Data Engineering", "Scrum Master", "Project Management", "Data Analytics")
$results = New-Object System.Collections.Generic.List[string]

for ($i = 0; $i -lt $parts.Length; $i++) {
    $p = $parts[$i]
    foreach ($kw in $courseKeywords) {
        if ($p.Contains($kw)) {
            # Grab some context strings around it
            $start = [Math]::Max(0, $i - 15)
            $end = [Math]::Min($parts.Length - 1, $i + 15)
            $results.Add("MATCH FOR '" + $kw + "' at index " + $i + ":")
            for ($j = $start; $j -le $end; $j++) {
                $prefix = if ($j -eq $i) { ">>> " } else { "    " }
                $results.Add($prefix + $parts[$j].Trim())
            }
            $results.Add("-" * 80)
            break
        }
    }
}

# Also let's extract testimonials (reviews/alumni)
$results.Add("=== TESTIMONIALS & OTHER REVIEWS ===")
$alumniKeywords = @("landed my dream job", "transformed my career", "confidence to excel", "Alumni", "London, UK")
for ($i = 0; $i -lt $parts.Length; $i++) {
    $p = $parts[$i]
    foreach ($kw in $alumniKeywords) {
        if ($p.ToLower().Contains($kw.ToLower())) {
            $results.Add($parts[$i].Trim())
            break
        }
    }
}

$results | Out-File -FilePath "extracted_courses.txt" -Encoding utf8
Write-Host "Extraction complete!"
