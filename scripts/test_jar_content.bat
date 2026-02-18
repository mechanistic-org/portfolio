@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

set MPXJ_LIB=C:\Users\erik\AppData\Roaming\Python\Python314\site-packages\mpxj\lib
set JAR_FILE=%MPXJ_LIB%\mpxj.jar

echo Listing JAR contents for MPPReader...
jar tf "%JAR_FILE%" | findstr MPPReader
