cls
$sourceDir = Split-Path $PSCommandPath -Parent
$destDir = Join-Path $sourceDir "thumbs"
$thumbHeight = 65

function main() {

    Add-Type -Assembly System.Drawing

    emptyThumbsDirectory

    getImages | % {createThumb $_}

}

function emptyThumbsDirectory() {
    Get-ChildItem -File -Path $destDir | Remove-Item
}

function getImages() {
    Get-ChildItem -File -Recurse -Path $sourceDir -Include "*.jpg"
}

function createThumb() {
    param (
        [System.IO.FileInfo] $sourceFile
    )

    Write-Output $sourceFile.Name

    $destFile = Join-Path $destDir (Split-Path $sourceFile -Leaf)
    $original = [System.Drawing.Bitmap]::FromFile($sourceFile.FullName)

    $thumbWidth = [int]($original.Width / $original.Height * $thumbHeight)

    $orientation = $original.PropertyItems | where {$_.Id -match "112|274|5029"}
    if ($orientation) {
        $original.RemovePropertyItem($orientation.Id)
        
        $orientation = $orientation.Value[0]

        if ($orientation -ne 1) {
            if ($orientation -eq 6) {
                $original.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
            } elseif ($orientation -eq 8) {
                $original.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone)
            } elseif ($orientation -eq 3) {
                $original.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone)
            }

            $newFile = $sourceFile.FullName -replace ".jpg",".new.jpg"
            $original.Save($newFile)
            $original.Dispose()
        
            $sourceFile.Delete()
            Get-Item -Path $newFile | Move-Item -Destination $sourceFile.FullName

            $original = [System.Drawing.Bitmap]::FromFile($sourceFile.FullName)
            $thumbWidth = [int]($original.Width / $original.Height * $thumbHeight)
        }
    }

    #$thumb = New-Object -TypeName System.Drawing.Bitmap($thumbWidth, $thumbHeight)
    #$graphics = [System.Drawing.Graphics]::FromImage($thumb)
    #$graphics.DrawImage($original, 0, 0, $thumbWidth, $thumbHeight);
    #$graphics.Dispose();

    $thumb = $original.GetThumbnailImage($thumbWidth, $thumbHeight, $null, [intptr]::Zero)

    $thumb.Save($destFile)
}


#$source = "C:\Windows\Web\Wallpaper\Windows\img0.jpg"
#$destination = "$Home\Pictures\thumb0.png"
#$scale = 0.25


## Open and resize the image
#$image = New-Object System.Windows.Media.Imaging.TransformedBitmap (New-Object System.Windows.Media.Imaging.BitmapImage $source),
#                                                                   (New-Object System.Windows.Media.ScaleTransform $scale,$scale)
## Put it on the clipboard (just for fun)
#[System.Windows.Clipboard]::SetImage( $image )

## Write out an image file:
#$stream = [System.IO.File]::Open($destination, "OpenOrCreate")
#$encoder = New-Object System.Windows.Media.Imaging.$([IO.Path]::GetExtension($destination).substring(1))BitmapEncoder
#$encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($image))
#$encoder.Save($stream)
#$stream.Dispose()


main
