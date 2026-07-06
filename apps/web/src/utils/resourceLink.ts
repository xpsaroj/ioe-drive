/** Where a link to a resource's detail page was clicked from - carried along as query
 * params so the detail page's breadcrumb can offer a real way back to it, instead of
 * always assuming the user arrived via the Resource Explorer. */
export interface ResourceOrigin {
    label: string;
    href: string;
}

export const resourceDetailHref = (resourceId: number, from?: ResourceOrigin) => {
    if (!from) return `/resources/r/${resourceId}`;

    const params = new URLSearchParams({ fromLabel: from.label, fromHref: from.href });
    return `/resources/r/${resourceId}?${params.toString()}`;
};
