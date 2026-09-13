$dest = 'Z:\moham\Desktop\github\pages\portfolio\public\images\portfolio'

$pairs = @(
    @('https://sabernasr.com/wp-content/uploads/2024/03/Sealy-Collection.jpg', 'sealy-collection.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2024/03/Sealy-Products-2021-arabic.jpg', 'sealy-products.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2024/03/Sealy.jpg', 'sealy-middle-east.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2024/03/maktabitech.jpg', 'maktabi.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2024/03/Founding-Day-2.jpg', 'saudi-founding-2.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2024/03/Curtain-Call-Mattress.jpg', 'sealy-mattress.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Valent-Health-Logo.jpg', 'valent-health.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Apachi.jpg', 'apachi.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Zahi8.jpg', 'zahi.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/ALtahrir-Koshary.png', 'altahrir.png'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Tayebat-Alsham.jpg', 'tayebat.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Asaad.jpg', 'asaad.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/latelierdenaila.jpg', 'latelier.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/SweetDiet.jpg', 'sweet-diet.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Glassfitti-Site.jpg', 'glassfitti.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2024/03/Sealy.jpg', 'sealyme.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2024/03/Sealy.jpg', 'sealy-social.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2024/03/Sealy.jpg', 'saudi-founding-3.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2024/03/Sealy.jpg', 'saudi-founding-1.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'saudi-holiday.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'crypto-sense.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'sealy-march.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'lean-community.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'my-it-guide.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'emoji-pizza.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'blue-print.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'blue-blog.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'lavanta-care.jpg'),
    @('https://sabernasr.com/wp-content/uploads/2023/03/Sealy.jpg', 'view-dubai.jpg')
)

foreach ($pair in $pairs) {
    $url = $pair[0]
    $file = $pair[1]
    $outFile = Join-Path $dest $file
    if (Test-Path $outFile) {
        Write-Host "SKIP: $file (exists)"
        continue
    }
    try {
        Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing -TimeoutSec 15
        Write-Host "OK: $file"
    } catch {
        Write-Host "FAIL: $file"
    }
}
