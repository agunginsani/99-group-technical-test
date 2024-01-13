import { NavLink, useFetcher, useLoaderData } from "@remix-run/react";
import { Listbox } from "@headlessui/react";
import {
  ArrowTrendingUpIcon,
  ChevronDownIcon,
  FireIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { Outlet } from "@remix-run/react";
import PropTypes from "prop-types";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { userPrefs } from "../cookies.server";
import clsx from "clsx";

const viewModes = [
  { label: "Card View", value: 0 },
  { label: "Classic View", value: 1 },
  { label: "Compact View", value: 2 },
];

export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  return json({ viewMode: cookie.viewMode });
}

export async function action({ request }) {
  const formData = await request.formData();

  switch (formData.get("_action")) {
    case "change-view-mode": {
      const cookieHeader = request.headers.get("Cookie");
      const cookie = (await userPrefs.parse(cookieHeader)) || {};

      cookie.viewMode = {
        label: formData.get("label"),
        value: formData.get("value"),
      };

      return redirect("", {
        headers: {
          "Set-Cookie": await userPrefs.serialize(cookie),
        },
      });
    }

    default:
      throw Error(`Unknown _action: ${action}`);
  }
}

export default function Subreddit() {
  return (
    <div className="py-5 px-6 flex flex-shrink-0 justify-center bg-black min-h-screen">
      <div className="w-[640px]">
        <section className="flex mb-2 bg-white py-2.5 px-3 rounded-md justify-between">
          <div className="flex gap-2 align-middle w-full">
            <SortNavLink to="hot">
              <FireIcon className="w-5 h-5" /> Hot
            </SortNavLink>
            <SortNavLink to="new">
              <SunIcon className="w-5 h-5" /> New
            </SortNavLink>
            <SortNavLink to="top">
              <ArrowTrendingUpIcon className="w-5 h-5" /> Top
            </SortNavLink>
          </div>
          <div className="flex-shrink-0">
            <ViewModeListbox />
          </div>
        </section>
        <Outlet />
      </div>
    </div>
  );
}

function SortNavLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-1 hover:bg-slate-200 font-semibold py-1.5 px-2 rounded-full flex-shrink-0",
          { "bg-slate-300": isActive }
        )
      }
    >
      {children}
    </NavLink>
  );
}

SortNavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node,
};

function ViewModeListbox() {
  const { viewMode } = useLoaderData();
  const fetcher = useFetcher();
  const selected = viewMode ?? viewModes[0];

  return (
    <Listbox
      value={selected}
      onChange={(value) => {
        fetcher.submit(
          { _action: "change-view-mode", ...value },
          { method: "POST" }
        );
      }}
    >
      <div className="relative">
        <Listbox.Button className="hover:bg-slate-200 py-1.5 px-2 rounded-full flex align-middle gap-1">
          <span className="text-sm">{selected.label}</span>
          <ChevronDownIcon className="h-5 w-5" />
        </Listbox.Button>
        <Listbox.Options className="absolute w-32 bg-white shadow-md rounded-md">
          {viewModes.map((item) => (
            <Listbox.Option key={item.value} value={item} className="p-2">
              {({ active }) => (
                <span className={active ? "text-blue-500" : ""}>
                  {item.label}
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
