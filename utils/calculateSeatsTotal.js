const Seat = require("../models/Seat");
const Zone = require("../models/Zone");

const calculateSeatsTotalAmount = async (seatIds, taxPercentage = 18) => {
  try {
    // 1) Get zoneCodes of given seats
    const zoneCodes = (await Seat.find({ _id: { $in: seatIds } })
      .select("zoneCode"))
      .map(seat => seat.zoneCode);

    // 2) Group by zoneCode + count seats
    const grouped = zoneCodes.reduce((acc, code) => {
      const existing = acc.find(item => item.name === code);
      if (existing) {
        existing.seats += 1;
      } else {
        acc.push({ name: code, seats: 1 });
      }
      return acc;
    }, []);

    // 3) Get Zone price info
    const zCodes = grouped.map(zone => zone.name);
    const zones = await Zone.find({ zoneCode: { $in: zCodes } }).select("zoneCode price name");

    // 4) Merge prices into grouped result
    const result = grouped.map(item => {
      const zone = zones.find(z => z.zoneCode === item.name);
      return {
        code: item.name,
        name: zone ? zone.name : '',
        seats: item.seats,
        price: zone ? zone.price : 0,
        total: zone ? zone.price * item.seats : 0
      };
    });

    // 5) Grand total without tax
    const subTotal = result.reduce((sum, z) => sum + z.total, 0);

    // 6) Apply tax (if > 0), else use default 18%
    const appliedTax = taxPercentage > 0 ? taxPercentage : 18;
    const taxAmount = (subTotal * appliedTax) / 100;
    const grandTotal = subTotal + taxAmount;

    return { 
      breakdown: result, 
      subTotal, 
      taxPercentage: appliedTax, 
      taxAmount, 
      grandTotal 
    };

  } catch (error) {
    console.error("Error calculating seats by zone:", error);
    throw error;
  }
};

module.exports = calculateSeatsTotalAmount;
