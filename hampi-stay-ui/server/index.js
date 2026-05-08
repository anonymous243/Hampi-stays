import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'hampi_luxury_secret_key_2026';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Root Welcome Route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: serif; text-align: center; padding: 50px; background: #fafaf9; color: #0c0a09; height: 100vh;">
      <h1 style="color: #d97706; font-style: italic;">HampiStays Luxury API</h1>
      <p style="font-weight: bold; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.1em;">Status: Online & Secure</p>
      <hr style="width: 50px; border-color: #d97706; margin: 20px auto;" />
      <p>Endpoints available: <code>/api/resorts</code>, <code>/api/auth/login</code></p>
    </div>
  `);
});

// ============================================================
// AUTH ROUTES (Secure & Encrypted)
// ============================================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { password, name, role } = req.body;
    const email = req.body.email.toLowerCase();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      console.log(`Registration attempt failed: Email ${email} already exists`);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password (End-to-End Security at rest)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: role || 'TRAVELLER',
        },
      });

      if (role === 'RESORT_OWNER') {
        await tx.resortOwner.create({
          data: {
            userId: newUser.id,
            businessName: `${name}'s Portfolio`, // Default business name
          },
        });
      }

      return newUser;
    });

    const token = jwt.sign({ userId: result.id, role: result.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: result.id, name: result.name, email: result.email, role: result.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email, phone } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { phone: phone || undefined }
        ]
      }
    });

    if (!user) {
      // For security, don't reveal if user exists or not, but in this dummy app we can be more helpful
      return res.status(404).json({ error: 'No account found with this information.' });
    }

    // In a real app, we would generate a token and send an email/SMS
    res.json({ message: 'Reset link sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`Login failed: User ${email} not found`);
      return res.status(404).json({ error: 'new_traveler_detected' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log(`Login failed: Password mismatch for ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ============================================================
// REVIEW ROUTES
// ============================================================

app.post('/api/reviews', async (req, res) => {
  try {
    const { userId, resortId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: { userId, resortId, rating, comment }
    });

    // Update resort average rating and count
    const resortReviews = await prisma.review.findMany({ where: { resortId } });
    const avgRating = resortReviews.reduce((acc, r) => acc + r.rating, 0) / resortReviews.length;
    
    await prisma.resort.update({
      where: { id: resortId },
      data: {
        rating: avgRating,
        reviewCount: resortReviews.length
      }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

app.get('/api/resorts/:resortId/reviews', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { resortId: req.params.resortId },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// ============================================================
// PROFILE & NOTIFICATION ROUTES
// ============================================================

app.patch('/api/users/:id', async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email, phone, avatar }
    });
    const { passwordHash, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.get('/api/users/:userId/notifications', async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// ============================================================
// BOOKING ROUTES
// ============================================================

app.post('/api/bookings', async (req, res) => {
  try {
    const { userId, resortId, roomId, checkIn, checkOut, guests, totalPrice, specialRequests } = req.body;
    const referenceNumber = `HS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const booking = await prisma.booking.create({
      data: {
        userId, resortId, roomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: Number(guests),
        totalPrice: Number(totalPrice),
        specialRequests,
        referenceNumber
      }
    });

    // Create a booking confirmation notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Booking Confirmed!',
        message: `Your booking (Ref: ${referenceNumber}) has been confirmed. Get ready for your Hampi escape!`,
        type: 'booking'
      }
    });

    // 🔔 NOTIFICATION SIMULATION (Twilio/SendGrid)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const resort = await prisma.resort.findUnique({ where: { id: resortId } });
    console.log(`[NOTIFICATION] Sending SMS to ${user.phone || 'customer'}: "Your booking ${referenceNumber} at ${resort.name} is confirmed!"`);
    console.log(`[NOTIFICATION] Sending Email to ${user.email}: "Booking Confirmation: ${resort.name} - ${referenceNumber}"`);

    res.status(201).json(booking);
  } catch (error) {
    console.error('❌ BOOKING ERROR:', error);
    if (error.code) console.error('Error Code:', error.code);
    if (error.meta) console.error('Error Meta:', error.meta);
    res.status(500).json({ 
      error: 'Failed to create booking', 
      details: error.message,
      code: error.code 
    });
  }
});

// ============================================================
// RESORT ROUTES
// ============================================================


// ============================================================
// RESORT ROUTES
// ============================================================

app.get('/api/resorts', async (req, res) => {
  try {
    const resorts = await prisma.resort.findMany({
      where: { status: 'APPROVED' },
      include: { roomTypes: true }
    });
    res.json(resorts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resorts' });
  }
});

app.get('/api/resorts/:slug', async (req, res) => {
  try {
    const resort = await prisma.resort.findUnique({
      where: { slug: req.params.slug },
      include: { roomTypes: true }
    });
    if (!resort) return res.status(404).json({ error: 'Resort not found' });
    res.json(resort);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/resorts', async (req, res) => {
  try {
    const { name, tagline, description, type, area, price, amenities, ownerId, category, houseRules, mealPackages, roomTypes, documents, images } = req.body;
    
    // Find the resort owner record first
    let owner = await prisma.resortOwner.findUnique({
      where: { userId: ownerId }
    });

    if (!owner) {
      // Auto-repair: If user has the role but no owner profile, create it now
      const user = await prisma.user.findUnique({ where: { id: ownerId } });
      if (user && user.role === 'RESORT_OWNER') {
        owner = await prisma.resortOwner.create({
          data: {
            userId: ownerId,
            businessName: `${user.name}'s Portfolio`
          }
        });
      } else {
        return res.status(404).json({ error: 'Resort owner profile not found. Please ensure you are registered as an owner.' });
      }
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(2, 5);
    
    const resort = await prisma.resort.create({
      data: {
        name,
        slug,
        tagline,
        description,
        type,
        category: category || 'Heritage',
        locationArea: area,
        locationLat: 15.3350,
        locationLng: 76.4600,
        pricePerNight: parseFloat(price) || 0,
        amenities,
        houseRules: houseRules || [],
        mealPackages: mealPackages || [],
        ownerId: owner.id,
        status: 'PENDING',
        images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=2000'],
        roomTypes: {
          create: (roomTypes || []).map((room) => ({
            name: room.name,
            description: room.description,
            pricePerNight: parseFloat(room.pricePerNight),
            capacity: parseInt(room.capacity),
            availableCount: parseInt(room.availableCount),
            images: []
          }))
        }
      },
      include: { roomTypes: true }
    });

    res.status(201).json(resort);
  } catch (error) {
    console.error('Error creating resort:', error);
    res.status(500).json({ error: 'Failed to create resort' });
  }
});

app.delete('/api/resorts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Manually delete bookings first because schema doesn't have onDelete: Cascade for Booking
    await prisma.booking.deleteMany({
      where: { resortId: id }
    });

    // Delete the resort (cascades to Room, RoomPriceOverride, RoomBlocking, Wishlist, Review, DiscountCode)
    await prisma.resort.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Resort deleted successfully' });
  } catch (error) {
    console.error('Delete resort error:', error);
    res.status(500).json({ error: 'Failed to delete resort' });
  }
});

app.get('/api/resorts/:resortId/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { resortId: req.params.resortId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resort bookings' });
  }
});

// ============================================================
// ADMIN ROUTES
// ============================================================
app.get('/api/users/:userId/bookings', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.params.userId },
      include: {
        resort: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.patch('/api/bookings/:bookingId/cancel', async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.bookingId },
      data: { status: 'CANCELLED' }
    });
    res.json(booking);
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

app.patch('/api/bookings/:id/confirm', async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CONFIRMED' },
      include: { user: true, resort: true }
    });
    
    // Simulate sending email to traveler
    console.log(`\n======================================================`);
    console.log(`📧 EMAIL SENT TO: ${booking.user.email}`);
    console.log(`SUBJECT: Your booking at ${booking.resort.name} is confirmed!`);
    console.log(`BODY: Dear ${booking.user.name}, your stay from ${new Date(booking.checkIn).toLocaleDateString()} to ${new Date(booking.checkOut).toLocaleDateString()} is fully confirmed. Ref: ${booking.referenceNumber}`);
    console.log(`======================================================\n`);

    res.json(booking);
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({ error: 'Failed to confirm booking' });
  }
});

app.patch('/api/bookings/:id/reject', async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
      include: { user: true, resort: true }
    });
    
    // Simulate sending email to traveler
    console.log(`\n======================================================`);
    console.log(`📧 EMAIL SENT TO: ${booking.user.email}`);
    console.log(`SUBJECT: Booking update for ${booking.resort.name}`);
    console.log(`BODY: Dear ${booking.user.name}, we are sorry but the resort could not accept your booking request. Ref: ${booking.referenceNumber}`);
    console.log(`======================================================\n`);

    res.json(booking);
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({ error: 'Failed to reject booking' });
  }
});

app.get('/api/owners/:userId/resorts', async (req, res) => {
  try {
    const owner = await prisma.resortOwner.findUnique({
      where: { userId: req.params.userId },
      include: { 
        resorts: { 
          include: { 
            roomTypes: {
              include: {
                priceOverrides: true,
                blockings: true
              }
            }, 
            bookings: { include: { user: true } },
            discountCodes: true
          } 
        } 
      }
    });
    res.json(owner?.resorts || []);
  } catch (error) {
    console.error('Fetch resorts error:', error);
    res.status(500).json({ error: 'Failed to fetch owner resorts' });
  }
});

// Get resort rooms
app.get('/api/resorts/:resortId/rooms', async (req, res) => {
  try {
    const { resortId } = req.params;
    const rooms = await prisma.room.findMany({
      where: { resortId }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new room
app.post('/api/rooms', async (req, res) => {
  try {
    const { resortId, name, description, pricePerNight, capacity, amenities, availableCount } = req.body;
    
    const room = await prisma.room.create({
      data: {
        resortId,
        name,
        description,
        pricePerNight: parseFloat(pricePerNight),
        capacity: parseInt(capacity),
        amenities: amenities || [],
        availableCount: parseInt(availableCount) || 1,
        images: [] // Placeholder for now
      }
    });
    
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// WISHLIST ROUTES
// ============================================================

app.post('/api/wishlist/toggle', async (req, res) => {
  try {
    const { userId, resortId } = req.body;
    const existing = await prisma.wishlist.findUnique({
      where: { userId_resortId: { userId, resortId } }
    });

    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      res.json({ saved: false });
    } else {
      await prisma.wishlist.create({ data: { userId, resortId } });
      res.json({ saved: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle wishlist' });
  }
});

app.get('/api/users/:userId/wishlist', async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.params.userId },
      include: { resort: true }
    });
    res.json(wishlist.map(w => w.resort));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add resort photo
app.post('/api/resorts/:id/photos', async (req, res) => {
  try {
    const { url } = req.body;
    const resort = await prisma.resort.update({
      where: { id: req.params.id },
      data: {
        images: {
          set: [...(await prisma.resort.findUnique({ where: { id: req.params.id } })).images, url]
        }
      },
      include: { roomTypes: true, bookings: { include: { user: true } } }
    });
    res.json(resort);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add photo' });
  }
});

// Delete resort photo
app.delete('/api/resorts/:id/photos', async (req, res) => {
  try {
    const { url } = req.body;
    const current = await prisma.resort.findUnique({ where: { id: req.params.id } });
    const resort = await prisma.resort.update({
      where: { id: req.params.id },
      data: {
        images: {
          set: current.images.filter(img => img !== url)
        }
      },
      include: { roomTypes: true, bookings: { include: { user: true } } }
    });
    res.json(resort);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Add room photo
app.post('/api/rooms/:id/photos', async (req, res) => {
  try {
    const { url } = req.body;
    const room = await prisma.room.findUnique({ where: { id: req.params.id } });
    await prisma.room.update({
      where: { id: req.params.id },
      data: {
        images: {
          set: [...(room.images || []), url]
        }
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add photo' });
  }
});

// Delete room photo
app.delete('/api/rooms/:id/photos', async (req, res) => {
  try {
    const { url } = req.body;
    const room = await prisma.room.findUnique({ where: { id: req.params.id } });
    await prisma.room.update({
      where: { id: req.params.id },
      data: {
        images: {
          set: room.images.filter(img => img !== url)
        }
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// ============================================================
// PHASE 6: INVENTORY & PRICING
// ============================================================

// Apply Price Overrides
app.post('/api/rooms/:roomId/price-overrides', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { dates, price, minNights } = req.body;

    const overrides = await Promise.all(
      dates.map(date => 
        prisma.roomPriceOverride.upsert({
          where: {
            roomId_date: {
              roomId,
              date: new Date(date)
            }
          },
          update: { price, minNights },
          create: {
            roomId,
            date: new Date(date),
            price,
            minNights
          }
        })
      )
    );

    res.json({ message: 'Price & Rules applied', count: overrides.length });
  } catch (error) {
    console.error('Price override error:', error);
    res.status(500).json({ error: 'Failed to apply pricing' });
  }
});

// Block Room Dates
app.post('/api/rooms/:roomId/blockings', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { dates, reason } = req.body;

    const blockings = await Promise.all(
      dates.map(date => 
        prisma.roomBlocking.upsert({
          where: {
            roomId_date: {
              roomId,
              date: new Date(date)
            }
          },
          update: { reason },
          create: {
            roomId,
            date: new Date(date),
            reason
          }
        })
      )
    );

    res.json({ message: 'Dates blocked successfully', count: blockings.length });
  } catch (error) {
    console.error('Blocking error:', error);
    res.status(500).json({ error: 'Failed to block dates' });
  }
});

// Create Discount Code
app.post('/api/resorts/:resortId/discount-codes', async (req, res) => {
  try {
    const { resortId } = req.params;
    const { 
      code, percentage, flatAmount, validFrom, validUntil, maxUses,
      isEarlyBird, minDaysInAdvance, isLastMinute, maxDaysInAdvance
    } = req.body;

    const discount = await prisma.discountCode.create({
      data: {
        code: code.toUpperCase(),
        percentage: percentage ? parseFloat(percentage) : null,
        flatAmount: flatAmount ? parseFloat(flatAmount) : null,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        maxUses: maxUses ? parseInt(maxUses) : null,
        isEarlyBird: !!isEarlyBird,
        minDaysInAdvance: minDaysInAdvance ? parseInt(minDaysInAdvance) : null,
        isLastMinute: !!isLastMinute,
        maxDaysInAdvance: maxDaysInAdvance ? parseInt(maxDaysInAdvance) : null,
        resortId
      }
    });

    res.status(201).json(discount);
  } catch (error) {
    console.error('Discount creation error:', error);
    res.status(500).json({ error: 'Failed to create discount code' });
  }
});

// ============================================================
// ADMIN ROUTES
// ============================================================

app.get('/api/admin/resorts/pending', async (req, res) => {
  try {
    const pendingResorts = await prisma.resort.findMany({
      where: { status: 'PENDING' },
      include: { owner: { include: { user: true } } }
    });
    res.json(pendingResorts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending resorts' });
  }
});

app.patch('/api/admin/resorts/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // APPROVED or REJECTED
    const resort = await prisma.resort.update({
      where: { id: req.params.id },
      data: { status },
      include: { owner: { include: { user: true } } }
    });
    
    // Notify owner
    await prisma.notification.create({
      data: {
        userId: resort.owner.userId,
        title: status === 'APPROVED' ? 'Resort Approved!' : 'Resort Update Required',
        message: status === 'APPROVED' 
          ? `Congratulations! ${resort.name} is now live on HampiStays.`
          : `Your resort listing ${resort.name} needs some changes before it can be approved.`,
        type: 'info'
      }
    });

    res.json(resort);
  } catch (error) {
    console.error('Admin status update error:', error);
    res.status(500).json({ error: 'Failed to update resort status' });
  }
});

app.get('/api/users/list', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        phone: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const [userCount, resortCount, bookingCount, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.resort.count(),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalPrice: true },
        where: { status: 'CONFIRMED' }
      })
    ]);

    res.json({
      userCount,
      resortCount,
      bookingCount,
      revenue: totalRevenue._sum.totalPrice || 0,
      platformRating: 4.8
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.get('/api/admin/resorts/active', async (req, res) => {
  try {
    const resorts = await prisma.resort.findMany({
      where: { status: 'APPROVED' },
      include: {
        owner: {
          include: { user: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(resorts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active resorts' });
  }
});

app.patch('/api/admin/resorts/:id/feature', async (req, res) => {
  const { id } = req.params;
  const { isFeatured } = req.body;
  try {
    const resort = await prisma.resort.update({
      where: { id },
      data: { isFeatured }
    });
    res.json(resort);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update featured status' });
  }
});

app.get('/api/admin/bookings/all', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        resort: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error('Fetch all bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch global bookings' });
  }
});

// Public Featured Resorts
app.get('/api/resorts/featured', async (req, res) => {
  try {
    const resorts = await prisma.resort.findMany({
      where: { 
        status: 'APPROVED',
        isFeatured: true 
      },
      take: 3,
      orderBy: { updatedAt: 'desc' }
    });
    res.json(resorts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured resorts' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 HampiStays Luxury API running on port ${PORT}`);
});
