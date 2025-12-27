
README_SYS_ADMIN.txt

digi system standardization for ProENGINEER

Initiated 

=============================================================

The following instructions are for standardizing Pro/ENGINEER 
for the digi environment.  Always check with the Pro/ENGINEER  
system administrator before implementing. 

All of the following files are in a directory called "foo" 
which should be copied to a directory along side the Pro/E 
loadpoint directory.  For example, if Pro/E is loaded at:

	/

the pro_stds directory should be loaded at:

	/

A backup of this directory should also reside in /

The system administrator should have complete access to
this directory and all users should have at least "read" 
privileges.  

The standardization is made up of 5 specific areas:

1.	A digi_main_config.pro and digi_menu_def.pro file for common
	environment settings and menu macros.  With links from the 
	loadpoint/text directory - see A-E below.
	These can be found in the digistds/configs directory.
	Note that there may be more than one of these, corresponding to 
	the different revisions of ProE.  These are essentially the same 
	except for some of the mapkeys called by the menudef.pro.

2.	A digi_pers_config.pro, which has the standard ProE mapkeys.
	Each user should copy this to their home directory, rename it to
	config.pro, and make any modifications which they want personally.
	This can be found in the digistds/configs directory.

2.	Keyboard templates used as a map key guide for the std mapkeys,
	designed to streamline the user interface.  The templates are
	Pro/ENGINEER drawings which can be plotted or modified.
	They can be found in the digistds/templates directory

3.	Start-part, assembly, and sheet metal files which all 
	new models will use as the starting point of the design.
	These can be found in the digistds/start_files directory.

4.	Drawing set up files (digistds/configs/digi-metric.dtl) to be  
	used as a starting point for setting up metric drawing standards.

5.	Directory locations for material, drawing format, group(UDF), 
	and symbol directories. All in the digistds directory.  Some of 
	these are directories empty, but they are there incase we ever
	need to use them.



=============================================================

	UNIX INSTALLATION OF STANDARD FILES
 
=============================================================


To install the files for use on any UNIX system follow the next
5 steps.  The "proe_loadpoint" is the directory location where the
Pro/ENGINEER software is installed.  

A.	All required files are in a directory called digistds which should be
	copied to a directory along side the Pro/E loadpoint directory.  For
	example, if Pro/E is loaded at:

             /usr/digipond/software/proe/proe15 (or proe16, proe17 etc)

	the digistds directory should be loaded at:

             /usr/digipond/software/proe/digistds         

	If the pro_stds directory is placed in this location,
	Pro/ENGINEER will be able to automatically find it
	by using the environment variable PRODIR which is set
	everytime you run Pro.  In config.pro and menu_def.pro
	you will find several paths starting with; $PRODIR/../pro_stds.

	The Pro/ENGINEER administrator should have complete access to
	this directory and all users should have at least "read" 
	privileges.              

B.	Change directory to proe_loadpoint(version 16)/text

C.	Create links for Version 16
	from:
	  proe_loadpoint(version 16)/text/config.pro
	  proe_loadpoint(version 16)/text/menu_def.pro 
	to:
	  /usr/digipond/software/proe/digistds/configs/digi_main_config16.pro
	  /usr/digipond/software/proe/digistds/configs/digi_menu_def.pro

	example:
		if the Pro/E loadpoint is:	
			/usr/digipond/software/proe/proe16
	and 	if the pro_stds directory is:	
			/usr/digipond/software/proe/digistds

	create the links by typing:

   ln -s /usr/digipond/software/proe/digistds/configs/digi_main_config16.pro 
	 config.pro (assuming that you are currently in the text directory)
   ln -s /usr/digipond/software/proe/digistds/configs/digi_menu_def.pro 
	 menu_def.pro (assuming that you are currently in the text directory)

	This will overwrite the existing menu_def.pro in the 
	proe_loadpoint/text directory, but this is OK. There should not be a 
	config.pro already in this directory.

D.	Create links for Version 17
	from:
	  proe_loadpoint(version 17)/text/config.pro
	  proe_loadpoint(version 17)/text/menu_def.pro 
	to:
	  /usr/digipond/software/proe/digistds/configs/digi_main_config17.pro
	  /usr/digipond/software/proe/digistds/configs/digi_menu_def.pro

	example:
		if the Pro/E loadpoint is:	
			/usr/digipond/software/proe/proe17
	and 	if the pro_stds directory is:	
			/usr/digipond/software/proe/digistds

	create the links by typing:

   ln -s /usr/digipond/software/proe/digistds/configs/digi_main_config17.pro 
	 config.pro (assuming that you are currently in the text directory)
   ln -s /usr/digipond/software/proe/digistds/configs/digi_menu_def.pro 
	 menu_def.pro (assuming that you are currently in the text directory)

	This will overwrite the existing menu_def.pro in the 
	proe_loadpoint/text directory, but this is OK. There should not be a 
	config.pro already in this directory.

E. 	NOTE - as subsequent versions of ProE are introduced, the 
	digi_main_config.pro file will need to be checked to make sure that
	the mapkeys still work. This is because the menu picks sometimes 
	change between revisions, and if the menu picks that the mapkeys 
	reference dont exist, then the custom menu additions from the 
	menu_def.pro will not work.
	
	If changes need to be made, then a digi_main_config18.pro file 
	will need to be created with the necessary changes, and symbolic
	links will need to be made from the proe18 loadpoint/text directory
	to this new config file.

===============================================================


The implementation data is all stored the pro_stds directory.
Within this directory are subdirectories containing the
following files:


clean 		A utility to clean unnecessary Pro/ENGINEER files from 
		any directory. This can be accessed in Pro/E through
		the UTILITIES menu.

configs		Standard config.pro, menu_def.pro, mapkeys, and drawing
		set up files.

format_dir	A directory to store and retrieve standard drawing
		formats

group_dir	A directory to store and retrieve standard user defined
		features.

material_dir	A directory to store and retrieve common material 
		properties.

orig_configs	A directory to store the original config.pro and 
		menu_def.pro files from the proe_loadpoint/text directory.

start_files	A standard part (regular and sheetmetal) and assembly
		which will be the starting point for all designs.

symbol_dir	A directory to store and retrieve common drawing symbols.

templates	Mapkey templates for various workstation keyboards to
		aid users in learning and using keyboard macros.






