// Morten's JavaScript Tree Menu
// version 2.3.2-macfriendly, dated 2002-06-10
// http://www.treemenu.com/

// Copyright (c) 2001-2002, Morten Wang & contributors
// All rights reserved.

// This software is released under the BSD License which should accompany
// it in the file "COPYING".  If you do not have this file you can access
// the license through the WWW at http://www.treemenu.com/license.txt

/******************************************************************************
* User-configurable options.                                                  *
******************************************************************************/

// All user-configurable options are set to their default values.
// Have a look at the section "Setting options" in the installation guide
// for description of each option and their possible values.

MTMDefaultTarget = "text";
MTMSubsGetPlus = "Always";
// MTMEmulateWE = true;

MTMUseCookies = true;
MTMCookieName = "MTMSiteCookie-1";
MTMCookieDays = 3;

MTMExtraCSS.addRule('a:hover','text-decoration: underline;');
MTMExtraCSS.addRule('a.tracked','color:#000000;background-color:#e0e0e0;');

// All options regarding the root text and it's icon
MTMRootColor = "white";
MTMenuText = "\\digiME// -- site contents:";
MTMRootIcon = "menu_root.gif";

/******************************************************************************
* User-configurable list of icons.                                            *
******************************************************************************/

var MTMIconList = null;
MTMIconList = new IconList();
MTMIconList.addIcon(new MTMIcon("menu_link_external.gif", "http://", "pre"));
MTMIconList.addIcon(new MTMIcon("menu_link_pdf.gif", ".pdf", "post"));
MTMIconList.addIcon(new MTMIcon("menu_link_pdf.gif", ".PDF", "post"));
MTMIconList.addIcon(new MTMIcon("iconword.gif", ".doc", "post"));
MTMIconList.addIcon(new MTMIcon("iconword.gif", ".DOC", "post"));

/******************************************************************************
* User-configurable menu.                                                     *
******************************************************************************/

// Main menu.

