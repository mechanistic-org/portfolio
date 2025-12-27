
README_USER.txt

digi individual user standardization for ProENGINEER


Initiated 

=============================================================

The following instructions are for customizing Pro/ENGINEER 
for your environment.  Always check with the Pro/ENGINEER  
system administrator before implementing. All the needed 
files for the digi set up can be found in the directory:

	/


1.	Either delete or move into a new directory (eg. old_configs)any 
	existing *.pro files in your home directory - ie. config.pro,
	and menu_def.pro.

2. 	Copy the digi_pers_config.pro to your home directory, rename it to
	config.pro, and make any modifications which you want personally.
	This can be found in /usr/digipond/projects/digistds/configs.
	Please reference the digi_main_config.pro to make sure that you do
	not accidentally overwrite any of these settings.  Note that there 
	may be more than one of these, corresponding to the different 
	revisions of ProE.  These are essentially the same except for some 
	of the mapkeys called by the menudef.pro.

3.  	Make a directory, in your home directory, called "trail". This can
	be done by typing "mkdir trail" while in your home directory.
	This is where all of your ProE trail files will be stored regardless 
	of where you start ProE from. It is good to purge this directory 
	once in a while. 

4.  	There is a main digi_menu_def.pro which adds the following menu
	picks:
	* A modify button in the features menu.
	* Trim corner and trim bound in the main sketcher menu.
	* A CD pick in the Misc menu which allows you to change directory
	  by picking from the directory list.
	* A RELOAD button in the Misc menu which allows you to reload
	  the config.pro file in your home directory.
	* An ADD STD LAYERS button in the layers menu which allows you to 
	  add the standard "digi layers" to an old part that does not
	  have them.
	* Shaded surface and silhouette toggles in the environment menu.
	* Startpart, sheetmetal and assembly buttons in the mode menu.
	* ADD and MOD PARAMS buttons in the part and assembly setup menus
	  which allow you to either add the "digi parameters" to old files
	  or modify the paramters in newer files.
	* Lots of new choices in the orientation menu.
	* CLEAN and PURGE DIR buttons in the utilities menu.
	* CALCULATOR button in the utilities menu.

5.  	If you want to add any personalized menu functions, you can do this 
    	with a menu_def.pro in your home directory.  This will simply add
	to the functions already made available in the digi_menu_def.pro.

6.	Within the digistds directory are subdirectories containing the
	following files:


clean 		A utility to clean unnecessary Pro/ENGINEER files from 
		any directory. This can be accessed in Pro/E through
		the UTILITIES menu.

configs/	Standard digi_config.pro, digi_menu_def.pro, menu_def files 
		digi_pers_config.pro for mapkeys etc.,drawing set up files 
		- digi_metric.dtl.

format_dir/	A directory to store and retrieve standard digi drawing
		formats

group_dir/	A directory to store and retrieve standard user defined
		features.  This is currently empty.

material_dir/	A directory to store and retrieve common material 
		properties. This is also currently empty.

orig_ptc_files/	A directory to store the original PTC config.pro and 
		menu_def.pro files, plus the original start parts
		and plotter files.

start_files/	A standard part (regular and sheetmetal) and assembly
		which will be the starting point for all new designs.
		These start files all have the following layers:

       NAME  |  STATUS  | #ID | SUB-LAYER NAMES

      _AXES      BLANK   
    _CONSTR      BLANK  	 _SURFACES _CURVES _IGES 
  _CSYS_ALL      BLANK   	_CSYS_DEF
  _CSYS_DEF      BLANK   
    _CURVES      BLANK   
    _DATUMS      BLANK   	_PLANES_ALL _CSYS_ALL _AXES _POINTS 
      _IGES      BLANK   
_PLANES_ALL      BLANK   	_PLANES_DEF
_PLANES_DEF      BLANK   
    _POINTS      BLANK   
  _SURFACES      BLANK   
		The appropriate entities are put on the appropriate layers
		as they are created, with the exception of iges data which 
		must be assigned to the _IGES layer.

symbol_dir/	A directory to store and retrieve common drawing symbols.

templates/	Mapkey templates for the standard mapkeys in the original
		digi_pers_config.pro to aid users in learning and using 
		the keyboard macros.  These are drawing files which can be 
		plotted out.






