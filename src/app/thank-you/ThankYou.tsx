"use client";

import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "./actions";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import PhonePreview from "@/components/PhonePreview";
import { formatPrice } from "@/lib/utils";
import { BASE_SHIPPING_PRICE } from "@/config/products";
import Image from "next/image";

const ThankYou = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { data } = useQuery({
    queryKey: ["get-payment-status"],
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 500,
  });

  if (data === undefined) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Loading your order...</h3>
          <p>This won't take long.</p>
        </div>
      </div>
    );
  }

  if (data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  const { configuration, billingAddress, shippingAddress, amount } = data;
  const { color } = configuration;

  const SHIPPING_PRICE = BASE_SHIPPING_PRICE / 100;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-base font-medium text-primary">Thank you!</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            We've received your order and are now processing it.
          </p>

          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900">Order number</p>
            <p className="mt-2 text-zinc-500">{orderId}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              You made a great choice!
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              We at CaseCobra believe that a phone case doesn't only need to
              look good, but also last you for the years to come. We offer a
              5-year print guarantee: If you case isn't of the highest quality,
              we'll replace it for free.
            </p>
          </div>
        </div>

        <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview
            croppedImageUrl={configuration.croppedImageUrl!}
            color={color!}
          />
        </div>

        <div>
          <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
            <div>
              <p className="font-medium text-gray-900">Shipping address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block capitalize">
                    {shippingAddress?.name}
                  </span>
                  <span className="block">{shippingAddress?.street}</span>
                  <span className="block">
                    <span className="capitalize">
                      {shippingAddress?.city
                        ? `${shippingAddress?.city}, `
                        : null}
                    </span>
                    <span className="uppercase">{shippingAddress?.state} </span>
                    {shippingAddress?.postalCode}
                  </span>
                  <span className="block"></span>
                </address>
              </div>
            </div>

            <div>
              <p className="font-medium text-gray-900">Billing address</p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block capitalize">
                    {billingAddress?.name}
                  </span>
                  <span className="block">{billingAddress?.street}</span>
                  <span className="block">
                    <span className="capitalize">
                      {billingAddress?.city
                        ? `${billingAddress?.city}, `
                        : null}
                    </span>
                    <span className="uppercase">{billingAddress?.state} </span>
                    {billingAddress?.postalCode}
                  </span>
                  <span className="block"></span>
                </address>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-medium text-zinc-900">Payment status</p>
              <p className="mt-2 text-zinc-700">Paid</p>
            </div>

            <div>
              <p className="font-medium text-zinc-900">Shipping Method</p>
              <p className="mt-1 text-zinc-700 flex gap-1 items-center">
                <Image
                  src="/usps-icon.png"
                  alt="USPS logo"
                  width={25}
                  height={25}
                  className="object-contain"
                />
                USPS, takes up to 3 to 5 business days
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Subtotal</p>
            <div className="text-zinc-700">{formatPrice(amount)}</div>
          </div>
          <div className="flex justify-between">
            <p className="font-medium text-zinc-900">Shipping</p>
            <div className="text-zinc-700">{formatPrice(SHIPPING_PRICE)}</div>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-lg text-zinc-900">Grand Total</p>
            <div className="font-semibold text-lg text-zinc-700">
              {formatPrice(amount + SHIPPING_PRICE)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
