rd /s /q tmp
del /s /q firefox-add-on-plain-text-V.x.zip
mkdir tmp
xcopy /y *.js tmp
xcopy /y *.html tmp
xcopy /y *.json tmp
xcopy /y *.md tmp
xcopy /y LICENSE tmp
xcopy /s/y/i ico tmp\ico
xcopy /s/y/i doc\*.png tmp\doc
CScript  zip.vbs  ./tmp  ./firefox-add-on-plain-text-V.x.zip
rd /s /q tmp