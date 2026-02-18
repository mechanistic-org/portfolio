@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%

set MPXJ_LIB=C:\Users\erik\AppData\Roaming\Python\Python314\site-packages\mpxj\lib
set CP=%MPXJ_LIB%\mpxj.jar;%MPXJ_LIB%\poi-5.5.1.jar;%MPXJ_LIB%\commons-collections4-4.5.0.jar

echo Testing Java Classpath...
java -cp "%CP%" net.sf.mpxj.mpp.MPPReader
