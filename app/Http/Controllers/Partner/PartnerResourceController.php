<?php

namespace App\Http\Controllers\Partner;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PartnerResourceController extends Controller
{
    private function typeMap(): array
    {
        return [
            'stays' => 'hotel',
            'cars' => 'car',
            'sports' => 'pitch',
            // allow direct canonical values too
            'hotel' => 'hotel',
            'car' => 'car',
            'pitch' => 'pitch',
        ];
    }

    private function validationAttributes(): array
    {
        return [
            'max_guests' => 'maximum guests',
            'exclude_infants' => 'exclude infants',
            'allows_children' => 'allows children',
            'breakfast_included' => 'breakfast included',
            'smoking_allowed' => 'smoking allowed',
            'parties_allowed' => 'parties/events allowed',
            'pets_allowed' => 'pets allowed',
            'check_in_from' => 'check-in from',
            'check_in_until' => 'check-in until',
            'check_out_from' => 'check-out from',
            'check_out_until' => 'check-out until',
            'postal_code' => 'postal code',
            'rooms.*.room_type' => 'room type',
            'rooms.*.beds.*.count' => 'bed count',
            'rooms.*.beds.*.type' => 'bed type',
        ];
    }

    private function validationRules(bool $isUpdate = false): array
    {
        $typeKeys = array_keys($this->typeMap());
        $required = $isUpdate ? ['sometimes'] : ['required'];

        return [
            'title' => [...$required, 'string', 'max:255'],
            'description' => [...$required, 'string'],
            'type' => [...$required, Rule::in($typeKeys)],
            'pricing_type' => [...$required, Rule::in(['hourly', 'daily', 'nightly'])],
            'price' => [...$required, 'numeric', 'min:0'],
            'location' => [...$required, 'string', 'max:255'],
            'address' => [...$required, 'string', 'max:500'],
            'postal_code' => [...$required, 'string', 'max:20'],
            'country' => ['nullable', 'string', 'max:255'],
            'max_guests' => [...$required, 'integer', 'min:1', 'max:1000'],
            'exclude_infants' => [...$required, 'boolean'],
            'bathrooms' => [...$required, 'integer', 'min:0', 'max:100'],
            'allows_children' => [...$required, 'boolean'],
            'breakfast_included' => ['sometimes', 'boolean'],
            'smoking_allowed' => ['sometimes', 'boolean'],
            'parties_allowed' => ['sometimes', 'boolean'],
            'pets_allowed' => ['sometimes', Rule::in(['yes', 'no', 'upon_request'])],
            'check_in_from' => ['sometimes', 'nullable', 'date_format:H:i'],
            'check_in_until' => ['sometimes', 'nullable', 'date_format:H:i'],
            'check_out_from' => ['sometimes', 'nullable', 'date_format:H:i'],
            'check_out_until' => ['sometimes', 'nullable', 'date_format:H:i'],
            'amenities' => ['sometimes', 'array'],
            'amenities.*' => ['string', 'max:100'],
            'custom_amenity' => ['sometimes', 'nullable', 'string', 'max:100'],
            'languages' => ['sometimes', 'array'],
            'languages.*' => ['string', 'max:60'],
            'rooms' => $isUpdate ? ['sometimes', 'array', 'min:1'] : ['required', 'array', 'min:1'],
            'rooms.*.room_type' => ['required_with:rooms', 'string', 'max:100'],
            'rooms.*.beds' => ['required_with:rooms', 'array', 'min:1'],
            'rooms.*.beds.*.count' => ['required_with:rooms', 'integer', 'min:1', 'max:20'],
            'rooms.*.beds.*.type' => ['required_with:rooms', 'string', 'max:50'],
        ];
    }

    private function syncPivotNames(int $resourceId, string $dictionaryTable, string $pivotTable, string $pivotColumn, array $values): void
    {
        $clean = collect($values)
            ->map(fn ($value) => trim((string) $value))
            ->filter()
            ->unique()
            ->values();

        DB::table($pivotTable)->where('resource_id', $resourceId)->delete();

        if ($clean->isEmpty()) {
            return;
        }

        $now = now();
        $linkRows = [];
        foreach ($clean as $name) {
            $existingId = DB::table($dictionaryTable)->where('name', $name)->value('id');

            if (!$existingId) {
                $existingId = DB::table($dictionaryTable)->insertGetId([
                    'name' => $name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            $linkRows[] = [
                'resource_id' => $resourceId,
                $pivotColumn => $existingId,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table($pivotTable)->insert($linkRows);
    }

    private function saveResourceRelations(Resource $resource, array $validated, bool $isUpdate = false): void
    {
        $meta = [
            'address' => $validated['address'] ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'country' => $validated['country'] ?? null,
        ];

        foreach ($meta as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            $resource->metadata()->updateOrCreate(
                ['key' => $key],
                ['value' => (string) $value]
            );
        }

        if (isset($validated['rooms'])) {
            if ($isUpdate) {
                $resource->rooms()->delete();
            }

            $resource->rooms()->createMany(
                collect($validated['rooms'])
                    ->map(fn ($room) => [
                        'room_type' => $room['room_type'],
                        'bed_type' => mb_substr(
                            collect($room['beds'])
                                ->map(fn ($bed) => $bed['count'].' '.$bed['type'])
                                ->join(', '),
                            0,
                            100
                        ),
                    ])
                    ->all()
            );
        }

        if (array_key_exists('amenities', $validated)) {
            $amenities = $validated['amenities'];
            if (!empty($validated['custom_amenity'])) {
                $amenities[] = $validated['custom_amenity'];
            }
            $this->syncPivotNames($resource->id, 'amenities', 'resource_amenities', 'amenity_id', $amenities);
        }

        if (array_key_exists('languages', $validated)) {
            $this->syncPivotNames($resource->id, 'languages', 'resource_languages', 'language_id', $validated['languages']);
        }
    }

    // 1. Show all listings owned by this specific partner
    public function index(Request $request)
    {
        // Only fetch resources that belong to the logged-in owner
        $resources = $request->user()->resources()->latest()->get();

        return Inertia::render('Partner/Resources/Index', [
            'resources' => $resources,
        ]);
    }

    // 2. Show the "Create a new Listing" form
    public function create()
    {
        return Inertia::render('Partner/Resources/Create');
    }

    // 3. Save the new listing to the database
    public function store(Request $request)
    {
        $typeMap = $this->typeMap();
        $validated = $request->validate(
            $this->validationRules(false),
            [],
            $this->validationAttributes()
        );

        DB::transaction(function () use ($request, $validated, $typeMap) {
            $resource = $request->user()->resources()->create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'type' => $typeMap[$validated['type']],
                'price' => $validated['price'],
                'pricing_type' => $validated['pricing_type'],
                'max_guests' => $validated['max_guests'],
                'exclude_infants' => $validated['exclude_infants'],
                'bathrooms' => $validated['bathrooms'],
                'allows_children' => $validated['allows_children'],
                'breakfast_included' => $validated['breakfast_included'] ?? false,
                'smoking_allowed' => $validated['smoking_allowed'] ?? false,
                'parties_allowed' => $validated['parties_allowed'] ?? false,
                'pets_allowed' => $validated['pets_allowed'] ?? 'no',
                'check_in_from' => $validated['check_in_from'] ?? null,
                'check_in_until' => $validated['check_in_until'] ?? null,
                'check_out_from' => $validated['check_out_from'] ?? null,
                'check_out_until' => $validated['check_out_until'] ?? null,
                'location' => $validated['location'],
            ]);
            $this->saveResourceRelations($resource, $validated, false);
        });

        return redirect()
            ->route('partner.resources.index')
            ->with('success', 'Listing created successfully!');
    }

    public function show(Request $request, $id)
    {
        $resource = Resource::findOrFail($id);

        if ($resource->user_id != null && $resource->user_id != $request->user()->id) {
            abort(403, 'Unauthorized access to this resource.');
        }

        // 🔥 USE THE REAL DATABASE VIEWS HERE:
        $analytics = [
            'total_views' => $resource->views, 
            'this_week_views' => 0, // We will build a complex timeline for this later
            'conversion_rate' => '0%', 
        ];

        $mockBookings = [
            ['id' => 1, 'customer' => 'Youssef Alaoui', 'date' => '2026-05-20', 'status' => 'confirmed', 'amount' => $resource->price * 2],
            ['id' => 2, 'customer' => 'Fatima Zahra', 'date' => '2026-05-25', 'status' => 'pending', 'amount' => $resource->price],
        ];

        $mockReviews = [
            ['id' => 1, 'author' => 'Karim B.', 'rating' => 5, 'comment' => 'Absolutely amazing experience, highly recommend!', 'date' => '2 days ago'],
            ['id' => 2, 'author' => 'Sarah M.', 'rating' => 4, 'comment' => 'Great place, but finding parking was a bit tricky.', 'date' => '1 week ago'],
        ];

        return Inertia::render('Partner/Resources/Show', [
            'resource' => $resource,
            'analytics' => $analytics,
            'bookings' => $mockBookings,
            'reviews' => $mockReviews,
        ]);
    }

    // 4 edit the resource (show the form)
    public function edit (Request $request, $id)
    {
        $resource = Resource::findorFail($id);
        if ($resource->user_id != null && $resource->user_id != $request->user()->id) {
            abort(403, 'Unauthorized access to this resource.');
        }

        return Inertia::render('Partner/Resources/Edit', [
            'resource' => $resource,
        ]);
    }
    // 6. Update the resource in the database (handle form submission)
    public function update(Request $request, $id)
    {
        $resource = Resource::findOrFail($id);
        
        if ($resource->user_id != null && $resource->user_id != $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate(
            $this->validationRules(true),
            [],
            $this->validationAttributes()
        );
        $typeMap = $this->typeMap();

        DB::transaction(function () use ($resource, $validated, $typeMap) {
            $resourceData = [];

            if (array_key_exists('title', $validated)) {
                $resourceData['title'] = $validated['title'];
            }
            if (array_key_exists('description', $validated)) {
                $resourceData['description'] = $validated['description'];
            }
            if (array_key_exists('type', $validated)) {
                $resourceData['type'] = $typeMap[$validated['type']];
            }
            if (array_key_exists('pricing_type', $validated)) {
                $resourceData['pricing_type'] = $validated['pricing_type'];
            }
            if (array_key_exists('price', $validated)) {
                $resourceData['price'] = $validated['price'];
            }
            if (array_key_exists('location', $validated)) {
                $resourceData['location'] = $validated['location'];
            }
            if (array_key_exists('max_guests', $validated)) {
                $resourceData['max_guests'] = $validated['max_guests'];
            }
            if (array_key_exists('exclude_infants', $validated)) {
                $resourceData['exclude_infants'] = $validated['exclude_infants'];
            }
            if (array_key_exists('bathrooms', $validated)) {
                $resourceData['bathrooms'] = $validated['bathrooms'];
            }
            if (array_key_exists('allows_children', $validated)) {
                $resourceData['allows_children'] = $validated['allows_children'];
            }
            if (array_key_exists('breakfast_included', $validated)) {
                $resourceData['breakfast_included'] = $validated['breakfast_included'];
            }
            if (array_key_exists('smoking_allowed', $validated)) {
                $resourceData['smoking_allowed'] = $validated['smoking_allowed'];
            }
            if (array_key_exists('parties_allowed', $validated)) {
                $resourceData['parties_allowed'] = $validated['parties_allowed'];
            }
            if (array_key_exists('pets_allowed', $validated)) {
                $resourceData['pets_allowed'] = $validated['pets_allowed'];
            }
            if (array_key_exists('check_in_from', $validated)) {
                $resourceData['check_in_from'] = $validated['check_in_from'];
            }
            if (array_key_exists('check_in_until', $validated)) {
                $resourceData['check_in_until'] = $validated['check_in_until'];
            }
            if (array_key_exists('check_out_from', $validated)) {
                $resourceData['check_out_from'] = $validated['check_out_from'];
            }
            if (array_key_exists('check_out_until', $validated)) {
                $resourceData['check_out_until'] = $validated['check_out_until'];
            }

            if (!empty($resourceData)) {
                $resource->update($resourceData);
            }

            $this->saveResourceRelations($resource, $validated, true);
        });

        return redirect()->route('partner.resources.index')->with('success', 'Listing updated successfully.');

    }

    // 7. Delete the resource
    public function destroy(Request $request, $id) 
    {
        $resource = Resource::findOrFail($id);

        // Relaxed security check to allow deleting older test data
        if ($resource->user_id != null && $resource->user_id != $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $resource->delete();

        return redirect()->route('partner.resources.index')->with('success', 'Listing deleted successfully.');
    }
}
