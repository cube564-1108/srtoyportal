$url = 'https://barhatflowers.ru/'
try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20
} catch {
    Write-Error "Request failed: $_"
    exit 1
}
$html = $response.Content
function Get-MetaValue($name) {
    $pattern = "<meta[^>]*name=['\"]$name['\"][^>]*content=['\"]([^'\"]*)['\"][^>]*>"
    $match = [regex]::Match($html, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($match.Success) { return $match.Groups[1].Value.Trim() }
    return ''
}
function Get-TagValue($tag) {
    $pattern = "<$tag[^>]*>(.*?)</$tag>"
    $match = [regex]::Match($html, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($match.Success) { return $match.Groups[1].Value.Trim() }
    return ''
}
$results = [ordered]@{
    Status = $response.StatusCode
    Title = Get-TagValue 'title'
    Description = Get-MetaValue 'description'
    Keywords = Get-MetaValue 'keywords'
    Robots = Get-MetaValue 'robots'
    Canonical = [regex]::Match($html, '<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Groups[1].Value.Trim()
    Lang = [regex]::Match($html, '<html[^>]*lang=["\']([^"\']+)["\']', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Groups[1].Value.Trim()
    H1Count = ([regex]::Matches($html, '<h1[^>]*>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
    H2Count = ([regex]::Matches($html, '<h2[^>]*>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
    ImgCount = ([regex]::Matches($html, '<img[^>]*>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
    ImgNoAlt = ([regex]::Matches($html, '<img[^>]*>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase) | Where-Object { -not [regex]::IsMatch($_.Value, '\balt=["\'][^"\']*["\']', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase) }).Count
}
foreach ($key in $results.Keys) {
    Write-Output "$key: $($results[$key])"
}
