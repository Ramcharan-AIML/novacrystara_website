$content = Get-Content -Raw -Path "downloads/index.js" -Encoding utf8
$parts = $content.Split('\"')

$results = New-Object System.Collections.Generic.List[string]

# Search for "/api/modules" or similar mock handlers
for ($i = 0; $i -lt $parts.Length; $i++) {
    $p = $parts[$i]
    if ($p.Contains("/api/modules") -or $p.Contains("/api/projects") -or $p.Contains("/api/enrollments")) {
        $results.Add("MATCH at index " + $i + " : " + $p.Trim())
        # surrounding context
        $start = [Math]::Max(0, $i - 10)
        $end = [Math]::Min($parts.Length - 1, $i + 10)
        for ($j = $start; $j -le $end; $j++) {
            $prefix = if ($j -eq $i) { ">>> " } else { "    " }
            $results.Add($prefix + $parts[$j].Trim())
        }
        $results.Add("-" * 40)
    }
}

$results | Out-File -FilePath "extracted_api.txt" -Encoding utf8
Write-Host "Done!"
