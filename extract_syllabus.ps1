$content = Get-Content -Raw -Path "downloads/index.js" -Encoding utf8
$parts = $content.Split('\"')

$results = New-Object System.Collections.Generic.List[string]

# Search for syllabus content, weeks, lessons, description, or objects in JS
for ($i = 0; $i -lt $parts.Length; $i++) {
    $p = $parts[$i]
    if ($p.ToLower().Contains("syllabus") -or $p.ToLower().Contains("curriculum") -or $p.ToLower().Contains("weeks") -or $p.ToLower().Contains("lessons")) {
        if ($p.Length -lt 500) {
            $results.Add("Index $i (" + $p.Length + " chars): " + $p.Trim())
            # surrounding context
            $start = [Math]::Max(0, $i - 5)
            $end = [Math]::Min($parts.Length - 1, $i + 5)
            for ($j = $start; $j -le $end; $j++) {
                if ($j -ne $i) {
                    $results.Add("   [$j]: " + $parts[$j].Trim())
                }
            }
            $results.Add("-" * 40)
        }
    }
}

$results | Out-File -FilePath "extracted_syllabus.txt" -Encoding utf8
Write-Host "Done!"
