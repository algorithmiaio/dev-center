---
categories: admin-panel
layout: article
title: Algorithm Categories
---

The Categories page provides functionality to manage the algorithm categories that are displayed on the main algorithm library page (the default title of this page will be "Algorithms" unless it's changed using the [UI Customization](/developers/administration/admin-panel/ui-customization/) options). You can use this feature to categorize algorithms based on whatever dimensions you choose. Some possibilities are to categorize algorithms based on their use case (e.g., in the screenshot below) or by the project to which they apply within your company.

![Admin Panel - Categories]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1609267091463.png)

To specify a new category to be displayed, click on the "Create New Category" button and "Create New Category" in the modal once you're satisfied with the information you've entered. To edit an existing category, click on the three vertical dots to its right and select "Edit". Fill out the fields, and when you're satisfied, select "Update Category".

By default, new categories are positioned at the end of the list of current categories. If you specify a "List Position" that is already occupied by another category, the category being edited will be inserted into the list at the given position and any algorithms with lower positions (higher absolute position numbers) will be bumped further down (their absolute list position values will increase).

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1617227450051.png)

As shown in the screenshot below, the newly created category is now selectable on the main algorithm library page, and you can use the tag you defined to associate algorithms with this category.

![]({{site.url}}/developers/images/post_images/algo-images-admin/algo-1617227558783.png)