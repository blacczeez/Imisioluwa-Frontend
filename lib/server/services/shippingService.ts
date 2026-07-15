import { prisma } from '@/lib/server/prisma';
import { logger } from '@/lib/server/utils/logger';
import { getNigeriaLgaDefaultShippingPrice } from '@/lib/server/utils/nigeriaShipping';

function isNigeriaOnlyZoneCountries(countries: string[]): boolean {
  if (!Array.isArray(countries) || countries.length !== 1) return false;
  return countries[0].toUpperCase() === 'NG';
}

export async function getRateByCountry(query: {
  country?: string | null;
  state?: string | null;
  lga?: string | null;
}) {
  try {
    const { country, state, lga } = query;

    if (!country) {
      return { status: 400 as const, body: { error: 'Country code is required' } };
    }

    const countryCode = country.toUpperCase();

    if (countryCode === 'NG') {
      if (!state || !lga) {
        return {
          status: 200 as const,
          body: {
            available: false,
            message: 'Select your state and local government to get shipping cost.',
          },
        };
      }

      const nigeriaRate = await prisma.nigeriaLgaShippingRate.findFirst({
        where: {
          state,
          lga,
          is_active: true,
        },
      });

      if (nigeriaRate) {
        return {
          status: 200 as const,
          body: {
            available: true,
            zone: `${nigeriaRate.state} - ${nigeriaRate.lga}`,
            currency: 'NGN',
            flatRate: nigeriaRate.price,
            freeShippingAbove: null,
            usingDefault: false,
          },
        };
      }

      const defaultPrice = await getNigeriaLgaDefaultShippingPrice();
      if (defaultPrice !== null) {
        return {
          status: 200 as const,
          body: {
            available: true,
            zone: `${state} - ${lga} (default)`,
            currency: 'NGN',
            flatRate: defaultPrice,
            freeShippingAbove: null,
            usingDefault: true,
          },
        };
      }

      return {
        status: 200 as const,
        body: {
          available: false,
          message:
            'Shipping is not set for this LGA and no default Nigeria shipping price is configured.',
        },
      };
    }

    let zone = await prisma.shippingZone.findFirst({
      where: {
        is_active: true,
        countries: { has: countryCode },
      },
    });

    if (!zone) {
      zone = await prisma.shippingZone.findFirst({
        where: {
          is_active: true,
          countries: { has: '*' },
        },
      });
    }

    if (!zone) {
      return {
        status: 200 as const,
        body: {
          available: false,
          message: 'We do not ship to your country yet. Please contact us.',
        },
      };
    }

    return {
      status: 200 as const,
      body: {
        available: true,
        zone: zone.name,
        currency: zone.currency,
        flatRate: zone.flat_rate,
        freeShippingAbove: zone.free_shipping_above,
      },
    };
  } catch (err) {
    logger.error('Get shipping rate error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getAllShippingZones() {
  try {
    const zones = await prisma.shippingZone.findMany({
      orderBy: { created_at: 'asc' },
    });
    return { status: 200 as const, body: zones };
  } catch (err) {
    logger.error('Get shipping zones error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function createShippingZone(body: {
  name: string;
  countries: string[];
  currency: string;
  flat_rate: number;
  free_shipping_above?: number | null;
}) {
  try {
    const { name, countries, currency, flat_rate, free_shipping_above } = body;

    if (isNigeriaOnlyZoneCountries(countries)) {
      return {
        status: 400 as const,
        body: {
          error:
            'Do not add Nigeria (NG) as a shipping zone. Configure Nigeria under Shipping → Nigeria (state + LGA) and default.',
        },
      };
    }

    const zone = await prisma.shippingZone.create({
      data: {
        name,
        countries,
        currency: currency.toUpperCase(),
        flat_rate,
        free_shipping_above: free_shipping_above || null,
      },
    });

    return { status: 201 as const, body: zone };
  } catch (err) {
    logger.error('Create shipping zone error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function updateShippingZone(
  id: string,
  data: {
    name?: string;
    countries?: string[];
    currency?: string;
    flat_rate?: number;
    free_shipping_above?: number | null;
    is_active?: boolean;
  }
) {
  try {
    if (data.countries !== undefined && isNigeriaOnlyZoneCountries(data.countries)) {
      return {
        status: 400 as const,
        body: {
          error:
            'Do not use Nigeria (NG) as a shipping zone. Configure Nigeria under Shipping → Nigeria (state + LGA) and default.',
        },
      };
    }

    const zone = await prisma.shippingZone.update({
      where: { id },
      data,
    });

    return { status: 200 as const, body: zone };
  } catch (err) {
    logger.error('Update shipping zone error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function deleteShippingZone(id: string) {
  try {
    await prisma.shippingZone.delete({ where: { id } });
    return { status: 200 as const, body: { message: 'Shipping zone deleted' } };
  } catch (err) {
    logger.error('Delete shipping zone error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function getNigeriaShippingRates() {
  try {
    const rates = await prisma.nigeriaLgaShippingRate.findMany({
      orderBy: [{ state: 'asc' }, { lga: 'asc' }],
    });
    return { status: 200 as const, body: rates };
  } catch (err) {
    logger.error('Get Nigeria shipping rates error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function upsertNigeriaShippingRate(body: {
  state: string;
  lga: string;
  price: number;
  is_active?: boolean;
}) {
  try {
    const { state, lga, price, is_active } = body;
    if (!state || !lga || price === undefined || price === null) {
      return { status: 400 as const, body: { error: 'State, LGA and price are required' } };
    }

    const rate = await prisma.nigeriaLgaShippingRate.upsert({
      where: {
        state_lga: {
          state,
          lga,
        },
      },
      create: {
        state,
        lga,
        price: Number(price),
        is_active: is_active !== false,
      },
      update: {
        price: Number(price),
        is_active: typeof is_active === 'boolean' ? is_active : true,
      },
    });

    return { status: 200 as const, body: rate };
  } catch (err) {
    logger.error('Upsert Nigeria shipping rate error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}

export async function deleteNigeriaShippingRate(id: string) {
  try {
    await prisma.nigeriaLgaShippingRate.delete({ where: { id } });
    return { status: 200 as const, body: { message: 'Nigeria shipping rate deleted' } };
  } catch (err) {
    logger.error('Delete Nigeria shipping rate error:', err);
    return { status: 500 as const, body: { error: 'Server error' } };
  }
}
