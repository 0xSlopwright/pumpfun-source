
void inferred_pump_window_0162
               (undefined8 *param_1,longlong param_2,ulonglong *param_3,undefined8 *param_4,
               longlong param_5)

{
  bool bVar1;
  undefined8 ***pppuVar2;
  undefined8 ***pppuVar3;
  undefined8 ***pppuVar4;
  int iVar5;
  ulonglong uVar6;
  longlong *plVar7;
  undefined8 *puVar8;
  undefined8 *puVar9;
  undefined8 *puVar10;
  undefined8 *puVar11;
  ulonglong uVar12;
  undefined8 ****ppppuVar13;
  longlong lVar14;
  longlong lVar15;
  ulonglong uVar16;
  longlong lVar17;
  longlong lVar18;
  undefined1 uVar19;
  undefined8 *puVar20;
  undefined8 ***local_758;
  undefined1 local_750;
  longlong local_720;
  undefined8 ***local_6f8;
  undefined8 ***local_6f0;
  undefined8 local_6e8;
  undefined8 local_6e0;
  undefined8 ***local_6d8;
  undefined8 ***local_6d0;
  undefined8 ***local_6c8;
  undefined8 ***local_6c0;
  undefined8 ***local_6b8;
  undefined8 ***local_6b0;
  undefined8 local_6a8;
  undefined8 local_6a0;
  undefined8 ***local_698;
  undefined8 ***local_690;
  undefined8 local_688;
  undefined8 local_680;
  undefined8 ***local_678;
  undefined8 ***local_670;
  undefined8 ***local_668;
  undefined8 ***local_660;
  undefined8 ***local_658;
  undefined8 ***local_650;
  undefined8 ***local_648;
  undefined8 ***local_640;
  undefined8 ***local_638;
  undefined8 ***local_630;
  undefined8 local_628;
  undefined8 local_620;
  undefined8 ***local_618;
  undefined8 ***local_610;
  undefined8 local_608;
  undefined8 local_600;
  undefined8 ***local_5f8;
  undefined8 ***local_5f0;
  undefined8 local_5e8;
  undefined8 local_5e0;
  undefined8 ***local_5d8;
  undefined8 ***local_5d0;
  undefined8 ***local_5c8;
  undefined8 ***local_5c0;
  undefined8 ***local_5b8;
  undefined8 ***local_5b0;
  undefined8 ***local_5a8;
  undefined8 ***local_5a0;
  undefined8 ***local_598;
  undefined8 ***local_590;
  undefined8 ***local_588;
  undefined8 ***local_580;
  undefined8 local_578;
  undefined8 local_570;
  undefined8 ***local_568;
  undefined8 ***local_560;
  undefined8 ***local_558;
  undefined8 ***local_550;
  undefined8 local_548;
  undefined8 local_540;
  undefined8 ***local_538;
  undefined8 ***local_530;
  undefined8 ***local_528;
  undefined8 ***local_520;
  undefined8 local_518;
  undefined8 local_510;
  undefined8 ***local_508;
  undefined8 ***local_500;
  undefined8 **local_4f8;
  undefined8 ***local_4f0;
  undefined8 ***local_4e8;
  longlong local_4e0;
  undefined8 ***local_4c0;
  undefined8 ***local_4b8;
  char *local_4b0;
  undefined8 ***local_4a8;
  undefined8 ***local_4a0;
  undefined8 ***local_498;
  undefined8 **local_490;
  undefined8 ***local_488;
  undefined8 ***local_480;
  undefined8 local_478;
  undefined1 local_470;
  undefined8 local_360;
  undefined8 ***local_358;
  undefined8 ***local_350;
  char *local_348;
  undefined8 ***local_340;
  undefined8 ***local_338;
  undefined8 ***local_330;
  undefined8 **local_328;
  undefined8 local_320;
  undefined8 ***local_318;
  undefined1 local_310;
  undefined1 auStack_300 [48];
  undefined1 auStack_2d0 [8];
  undefined4 local_2c8;
  undefined1 auStack_2a0 [48];
  undefined1 auStack_270 [88];
  longlong *local_218 [6];
  undefined8 local_1e8;
  longlong local_1e0;
  longlong local_1d8;
  longlong local_1d0;
  longlong local_1c8;
  undefined8 local_1c0;
  longlong local_1b8;
  undefined *local_1b0;
  undefined *local_1a8;
  longlong local_1a0 [3];
  undefined8 ***local_188;
  undefined8 ***local_180;
  undefined8 ***local_178;
  char *local_170;
  undefined8 **local_168;
  undefined8 local_160;
  undefined8 **local_158;
  char *local_150;
  undefined8 ***local_148;
  undefined8 ***local_140;
  undefined8 ***local_138;
  char *local_130;
  undefined8 **local_128;
  undefined8 local_120;
  undefined8 **local_118;
  char *local_110;
  undefined8 **local_108;
  undefined8 local_100;
  undefined8 local_f8;
  undefined1 local_f0 [48];
  undefined8 ***local_c0;
  undefined8 local_b8;
  ulonglong local_90;
  ulonglong local_88;
  ulonglong local_80;
  undefined8 ***local_60;
  undefined8 ***local_58;
  undefined8 ***local_50;
  undefined8 local_48;
  undefined8 ***local_30;
  undefined8 ***local_28;
  undefined8 ***local_20;
  undefined8 local_18;
  
  lVar14 = *(longlong *)(param_5 + -0xfd8);
  uVar6 = *(ulonglong *)(param_5 + -0xfe0);
  plVar7 = *(longlong **)(param_5 + -0xff8);
  puVar20 = *(undefined8 **)(param_5 + -0x1000);
  lVar18 = *(longlong *)(param_5 + -0xff0);
  if ((lVar18 != 0) &&
     (lVar15 = *(longlong *)(param_2 + 8), *(char *)(*(longlong *)(lVar15 + 0xf8) + 0x43c) == '\0'))
  {
    inferred_pump_window_0588(&local_60,&DAT_ram_001b5f24);
    local_20 = (undefined8 ****)0x0;
    local_28 = (undefined8 ***)0x1;
    local_30 = (undefined8 ***)0x0;
    local_480 = (undefined8 ***)&DAT_ram_001bd838;
    local_488 = &local_30;
    local_470 = 3;
    local_478 = 0x20;
    local_498 = (undefined8 ****)0x0;
    local_4a8 = (undefined8 ****)0x0;
    lVar14 = inferred_pump_window_0590(&DAT_ram_001b5f24,&local_4a8);
    if (lVar14 != 0) goto LAB_ram_00020e60;
    local_318 = local_20;
    local_320 = local_28;
    local_328 = local_30;
    local_340 = local_60;
    local_338 = local_58;
    local_330 = local_50;
    local_358 = (undefined8 ***)0x1b6877;
    local_2c8 = 0x17a0;
    local_310 = 2;
    local_348 = (char *)CONCAT44(local_348._4_4_,0x2c5);
    local_350 = (undefined8 ***)0x1e;
    local_360 = (undefined8 ****)0x0;
    inferred_pump_window_0792(&local_6e8,&local_360);
    inferred_pump_window_0006
              (&local_6f8,local_6e8,local_6e0,*(undefined1 *)(*(longlong *)(lVar15 + 0xf8) + 0x43c),
               1);
    local_6d0 = local_6f0;
    local_6d8 = local_6f8;
    goto LAB_ram_00020fd0;
  }
  if (*(longlong *)(param_5 + -0xfe8) != 0) {
    inferred_pump_window_0588(&local_60,&DAT_ram_001b5df4);
    local_20 = (undefined8 ****)0x0;
    local_28 = (undefined8 ***)0x1;
    local_30 = (undefined8 ***)0x0;
    local_480 = (undefined8 ***)&DAT_ram_001bd838;
    local_488 = &local_30;
    local_470 = 3;
    local_478 = 0x20;
    local_498 = (undefined8 ****)0x0;
    local_4a8 = (undefined8 ****)0x0;
    lVar14 = inferred_pump_window_0590(&DAT_ram_001b5df4,&local_4a8);
    if (lVar14 != 0) goto LAB_ram_00020e60;
    local_318 = local_20;
    local_320 = local_28;
    local_328 = local_30;
    local_340 = local_60;
    local_338 = local_58;
    local_330 = local_50;
    local_358 = (undefined8 ***)0x1b6877;
    local_2c8 = 0x17c2;
    local_310 = 2;
    local_348 = (char *)CONCAT44(local_348._4_4_,0x2cc);
    local_350 = (undefined8 ***)0x1e;
    local_360 = (undefined8 ****)0x0;
    inferred_pump_window_0792(&local_6d8,&local_360);
    goto LAB_ram_00020fd0;
  }
  if (lVar14 == 0) {
    local_4e0 = plVar7[3];
    local_4e8 = (undefined8 ***)plVar7[2];
    local_4f0 = (undefined8 ***)plVar7[1];
    local_4f8 = (undefined8 ***)*plVar7;
  }
  else {
    if (*(char *)(*(longlong *)(*(longlong *)(param_2 + 8) + 0xf8) + 0x43f) == '\0') {
      inferred_pump_window_0588(&local_60,&DAT_ram_001b5db8);
      local_20 = (undefined8 ****)0x0;
      local_28 = (undefined8 ***)0x1;
      local_30 = (undefined8 ***)0x0;
      local_480 = (undefined8 ***)&DAT_ram_001bd838;
      local_488 = &local_30;
      local_470 = 3;
      local_478 = 0x20;
      local_498 = (undefined8 ****)0x0;
      local_4a8 = (undefined8 ****)0x0;
      lVar14 = inferred_pump_window_0590(&DAT_ram_001b5db8,&local_4a8);
      if (lVar14 != 0) goto LAB_ram_00020e60;
      local_318 = local_20;
      local_320 = local_28;
      local_328 = local_30;
      local_340 = local_60;
      local_338 = local_58;
      local_330 = local_50;
      local_358 = (undefined8 ***)0x1b6877;
      local_2c8 = 0x17c4;
      local_310 = 2;
      local_348 = (char *)CONCAT44(local_348._4_4_,0x2cf);
      local_350 = (undefined8 ***)0x1e;
      local_360 = (undefined8 ****)0x0;
      inferred_pump_window_0792(&local_6c8,&local_360);
      local_6d0 = local_6c0;
      local_6d8 = local_6c8;
      goto LAB_ram_00020fd0;
    }
    puVar8 = (undefined8 *)**(undefined8 **)(*(longlong *)(param_2 + 8) + 0x58);
    local_4a8 = (undefined8 ***)*puVar8;
    local_4a0 = (undefined8 ***)puVar8[1];
    local_498 = (undefined8 ***)puVar8[2];
    local_490 = (undefined8 **)puVar8[3];
    local_30 = (undefined8 ***)0x1b68be;
    local_20 = &local_4a8;
    local_28 = (undefined8 ***)0xe;
    local_18 = 0x20;
    inferred_pump_window_0885(&local_360,&local_30,2,&DAT_ram_001b79df);
    local_4e0 = (longlong)local_348;
    local_4e8 = local_350;
    local_4f0 = local_358;
    local_4f8 = local_360;
  }
  local_348 = (char *)0x0;
  local_350 = (undefined8 ****)0x0;
  local_358 = (undefined8 ****)0x0;
  local_360 = (undefined8 ****)0x0;
  iVar5 = inferred_pump_window_1024(&local_4f8,&local_360,0x20);
  if (iVar5 == 0) {
    inferred_pump_window_0588(&local_60,&DAT_ram_001b5e04);
    local_20 = (undefined8 ****)0x0;
    local_28 = (undefined8 ***)0x1;
    local_30 = (undefined8 ***)0x0;
    local_480 = (undefined8 ***)&DAT_ram_001bd838;
    local_488 = &local_30;
    local_470 = 3;
    local_478 = 0x20;
    local_498 = (undefined8 ****)0x0;
    local_4a8 = (undefined8 ****)0x0;
    lVar14 = inferred_pump_window_0590(&DAT_ram_001b5e04,&local_4a8);
    if (lVar14 != 0) goto LAB_ram_00020e60;
    local_318 = local_20;
    local_320 = local_28;
    local_328 = local_30;
    local_340 = local_60;
    local_338 = local_58;
    local_330 = local_50;
    local_358 = (undefined8 ***)0x1b6877;
    local_2c8 = 0x178e;
    local_310 = 2;
    local_348 = (char *)CONCAT44(local_348._4_4_,0x2dc);
    local_350 = (undefined8 ***)0x1e;
    local_360 = (undefined8 ****)0x0;
    inferred_pump_window_0792(&local_6a8,&local_360);
    local_348 = (char *)local_4e0;
    local_350 = local_4e8;
    local_358 = local_4f0;
    local_360 = (undefined8 ****)local_4f8;
    local_340 = (undefined8 ***)0x0;
    local_338 = (undefined8 ***)0x0;
    local_330 = (undefined8 ***)0x0;
    local_328 = (undefined8 **)0x0;
    inferred_pump_window_0798(&local_6b8,local_6a8,local_6a0,&local_360);
    local_6d0 = local_6b0;
    local_6d8 = local_6b8;
    goto LAB_ram_00020fd0;
  }
  lVar15 = *(longlong *)(param_2 + 8);
  local_720 = *(longlong *)(lVar15 + 0xf8);
  if (*(char *)(local_720 + 0x43b) == '\0') {
    inferred_pump_window_0588(&local_60,&DAT_ram_001b5ea0);
    local_20 = (undefined8 ****)0x0;
    local_28 = (undefined8 ***)0x1;
    local_30 = (undefined8 ***)0x0;
    local_480 = (undefined8 ***)&DAT_ram_001bd838;
    local_488 = &local_30;
    local_470 = 3;
    local_478 = 0x20;
    local_498 = (undefined8 ****)0x0;
    local_4a8 = (undefined8 ****)0x0;
    lVar14 = inferred_pump_window_0590(&DAT_ram_001b5ea0,&local_4a8);
    if (lVar14 != 0) goto LAB_ram_00020e60;
    local_318 = local_20;
    local_320 = local_28;
    local_328 = local_30;
    local_340 = local_60;
    local_338 = local_58;
    local_330 = local_50;
    local_358 = (undefined8 ***)0x1b6877;
    local_2c8 = 0x179e;
    local_310 = 2;
    local_348 = (char *)CONCAT44(local_348._4_4_,0x2e2);
    local_350 = (undefined8 ***)0x1e;
    local_360 = (undefined8 ****)0x0;
    inferred_pump_window_0792(&local_688,&local_360);
    inferred_pump_window_0006
              (&local_698,local_688,local_680,*(undefined1 *)(*(longlong *)(lVar15 + 0xf8) + 0x43b),
               1);
    local_6d0 = local_690;
    local_6d8 = local_698;
    goto LAB_ram_00020fd0;
  }
  uVar12 = *(ulonglong *)(param_2 + 0x18);
  if (uVar12 == 0) {
    bVar1 = false;
    local_4b0 = (char *)0x0;
    local_4b8 = (undefined8 ****)0x0;
    local_4c0 = (undefined8 ****)0x0;
    uVar16 = 0;
    local_188 = (undefined8 ****)0x0;
  }
  else {
    if (uVar12 < 3) {
      inferred_pump_window_0588(&local_60,&DAT_ram_001b5f20);
      local_20 = (undefined8 ****)0x0;
      local_28 = (undefined8 ***)0x1;
      local_30 = (undefined8 ***)0x0;
      local_480 = (undefined8 ***)&DAT_ram_001bd838;
      local_488 = &local_30;
      local_470 = 3;
      local_478 = 0x20;
      local_498 = (undefined8 ****)0x0;
      local_4a8 = (undefined8 ****)0x0;
      lVar14 = inferred_pump_window_0590(&DAT_ram_001b5f20,&local_4a8);
      if (lVar14 != 0) goto LAB_ram_00020e60;
      local_318 = local_20;
      local_320 = local_28;
      local_328 = local_30;
      local_340 = local_60;
      local_338 = local_58;
      local_330 = local_50;
      local_358 = (undefined8 ***)0x1b6877;
      local_2c8 = 0x178b;
      local_310 = 2;
      local_348 = (char *)CONCAT44(local_348._4_4_,0xc6);
      local_350 = (undefined8 ***)0x1e;
      local_360 = (undefined8 ****)0x0;
      inferred_pump_window_0792(&local_5a8,&local_360);
      local_88 = CONCAT44(local_88._4_4_,3);
      local_90 = uVar12;
      if ((undefined8 ****)local_5a8 == (undefined8 ****)0x0) {
        local_498 = (undefined8 ****)0x0;
        local_4a0 = (undefined8 ****)0x1;
        local_4a8 = (undefined8 ****)0x0;
        local_338 = (undefined8 ***)&DAT_ram_001bd838;
        local_340 = &local_4a8;
        local_328 = (undefined8 **)CONCAT71(local_328._1_7_,3);
        local_330 = (undefined8 ***)&DAT_ram_00000020;
        local_350 = (undefined8 ****)0x0;
        local_360 = (undefined8 ****)0x0;
        lVar14 = inferred_pump_window_1015(&local_90,&local_360);
        if (lVar14 != 0) goto LAB_ram_00020e60;
        local_50 = local_498;
        local_58 = local_4a0;
        local_60 = local_4a8;
        local_20 = (undefined8 ****)0x0;
        local_28 = (undefined8 ***)0x1;
        local_30 = (undefined8 ***)0x0;
        local_338 = (undefined8 ***)&DAT_ram_001bd838;
        local_340 = &local_30;
        local_328 = (undefined8 **)CONCAT71(local_328._1_7_,3);
        local_330 = (undefined8 ***)&DAT_ram_00000020;
        local_350 = (undefined8 ****)0x0;
        local_360 = (undefined8 ****)0x0;
        lVar14 = inferred_pump_window_1012(&local_88,&local_360);
        if (lVar14 != 0) goto LAB_ram_00020e60;
        local_480 = local_20;
        local_488 = local_28;
        local_490 = local_30;
        local_4a8 = local_60;
        local_4a0 = local_58;
        local_498 = local_50;
        inferred_pump_window_1021((longlong)&local_360 + 7,&local_4a8,0x30);
        lVar14 = 0x51;
        ppppuVar13 = (undefined8 ****)(local_5a0 + 10);
      }
      else {
        local_498 = (undefined8 ****)0x0;
        local_4a0 = (undefined8 ****)0x1;
        local_4a8 = (undefined8 ****)0x0;
        local_338 = (undefined8 ***)&DAT_ram_001bd838;
        local_340 = &local_4a8;
        local_328 = (undefined8 **)CONCAT71(local_328._1_7_,3);
        local_330 = (undefined8 ***)&DAT_ram_00000020;
        local_350 = (undefined8 ****)0x0;
        local_360 = (undefined8 ****)0x0;
        lVar14 = inferred_pump_window_1015(&local_90,&local_360);
        if (lVar14 != 0) goto LAB_ram_00020e60;
        local_50 = local_498;
        local_58 = local_4a0;
        local_60 = local_4a8;
        local_20 = (undefined8 ****)0x0;
        local_28 = (undefined8 ***)0x1;
        local_30 = (undefined8 ***)0x0;
        local_338 = (undefined8 ***)&DAT_ram_001bd838;
        local_340 = &local_30;
        local_328 = (undefined8 **)CONCAT71(local_328._1_7_,3);
        local_330 = (undefined8 ***)&DAT_ram_00000020;
        local_350 = (undefined8 ****)0x0;
        local_360 = (undefined8 ****)0x0;
        lVar14 = inferred_pump_window_1012(&local_88,&local_360);
        if (lVar14 != 0) goto LAB_ram_00020e60;
        local_480 = local_20;
        local_488 = local_28;
        local_490 = local_30;
        local_4a8 = local_60;
        local_4a0 = local_58;
        local_498 = local_50;
        inferred_pump_window_1021((longlong)&local_360 + 7,&local_4a8,0x30);
        lVar14 = 0x39;
        ppppuVar13 = (undefined8 ****)(local_5a0 + 7);
      }
      *(char *)ppppuVar13 = '\0';
      inferred_pump_window_1021((char *)((longlong)local_5a0 + lVar14),&local_360,0x37);
      local_6d0 = local_5a0;
      local_6d8 = local_5a8;
      goto LAB_ram_00020fd0;
    }
    puVar8 = *(undefined8 **)(param_2 + 0x10);
    puVar9 = (undefined8 *)puVar8[0xc];
    local_150 = (char *)puVar9[3];
    local_158 = (undefined8 **)puVar9[2];
    local_160 = puVar9[1];
    local_168 = (undefined8 **)*puVar9;
    iVar5 = inferred_pump_window_1024(&local_168,&DAT_ram_001b5b28,0x20);
    if ((iVar5 != 0) &&
       (iVar5 = inferred_pump_window_1024(&local_168,&DAT_ram_001b5ca8,0x20), iVar5 != 0)) {
      inferred_pump_window_0588(&local_60,&DAT_ram_001b5f4c);
      local_20 = (undefined8 ****)0x0;
      local_28 = (undefined8 ***)0x1;
      local_30 = (undefined8 ***)0x0;
      local_480 = (undefined8 ***)&DAT_ram_001bd838;
      local_488 = &local_30;
      local_470 = 3;
      local_478 = 0x20;
      local_498 = (undefined8 ****)0x0;
      local_4a8 = (undefined8 ****)0x0;
      lVar14 = inferred_pump_window_0590(&DAT_ram_001b5f4c,&local_4a8);
      if (lVar14 != 0) goto LAB_ram_00020e60;
      local_318 = local_20;
      local_320 = local_28;
      local_328 = local_30;
      local_340 = local_60;
      local_338 = local_58;
      local_330 = local_50;
      local_358 = (undefined8 ***)0x1b6877;
      local_2c8 = 0x17b0;
      local_310 = 2;
      local_348 = (char *)CONCAT44(local_348._4_4_,0xcd);
      local_350 = (undefined8 ***)0x1e;
      local_360 = (undefined8 ****)0x0;
      inferred_pump_window_0792(&local_508,&local_360);
      local_6d0 = local_500;
      local_6d8 = local_508;
      goto LAB_ram_00020fd0;
    }
    if (*(char *)((longlong)puVar8 + 0x8a) == '\0') {
      inferred_pump_window_0588(&local_60,&DAT_ram_001b5f4c);
      local_20 = (undefined8 ****)0x0;
      local_28 = (undefined8 ***)0x1;
      local_30 = (undefined8 ***)0x0;
      local_480 = (undefined8 ***)&DAT_ram_001bd838;
      local_488 = &local_30;
      local_470 = 3;
      local_478 = 0x20;
      local_498 = (undefined8 ****)0x0;
      local_4a8 = (undefined8 ****)0x0;
      lVar14 = inferred_pump_window_0590(&DAT_ram_001b5f4c,&local_4a8);
      if (lVar14 != 0) goto LAB_ram_00020e60;
      local_318 = local_20;
      local_320 = local_28;
      local_328 = local_30;
      local_340 = local_60;
      local_338 = local_58;
      local_330 = local_50;
      local_358 = (undefined8 ***)0x1b6877;
      local_2c8 = 0x17b0;
      local_310 = 2;
      local_348 = (char *)CONCAT44(local_348._4_4_,0xd2);
      local_350 = (undefined8 ***)0x1e;
      local_360 = (undefined8 ****)0x0;
      inferred_pump_window_0792(&local_598,&local_360);
      local_6d0 = local_590;
      local_6d8 = local_598;
      goto LAB_ram_00020fd0;
    }
    puVar9 = (undefined8 *)*puVar8;
    local_130 = (char *)puVar9[3];
    local_138 = (undefined8 ***)puVar9[2];
    local_140 = (undefined8 ***)puVar9[1];
    local_148 = (undefined8 ***)*puVar9;
    iVar5 = inferred_pump_window_1024(&local_148,&DAT_ram_001b5cc8,0x20);
    if (iVar5 != 0) {
      local_348 = (char *)0x0;
      local_350 = (undefined8 ****)0x0;
      local_358 = (undefined8 ****)0x0;
      local_360 = (undefined8 ****)0x0;
      iVar5 = inferred_pump_window_1024(&local_148,&local_360,0x20);
      if (iVar5 != 0) {
        iVar5 = inferred_pump_window_1024(&local_148,&DAT_ram_001b5a88,0x20);
        if (iVar5 == 0) {
          inferred_pump_window_0588(&local_340,&DAT_ram_001b5e48);
          inferred_pump_window_0053(&local_328,&DAT_ram_001b5e48);
          local_358 = (undefined8 ***)0x1b6877;
          local_310 = 2;
          local_348 = (char *)CONCAT44(local_348._4_4_,0xdc);
          local_350 = (undefined8 ***)0x1e;
          local_360 = (undefined8 ****)0x0;
          local_2c8 = 0x17af;
          inferred_pump_window_0792(&local_578,&local_360);
          local_348 = local_130;
          local_350 = local_138;
          local_358 = local_140;
          local_360 = (undefined8 ****)local_148;
          local_340 = (undefined8 ***)0xb8e65fde9ffc0d83;
          local_338 = (undefined8 ***)0x8a1ee976a4047caa;
          local_330 = (undefined8 ***)0x19fa90ad4a26bbc6;
          local_328 = (undefined8 **)0x5e5b3e5cd849dfc9;
          inferred_pump_window_0798(&local_588,local_578,local_570,&local_360);
          local_6d0 = local_580;
          local_6d8 = local_588;
          goto LAB_ram_00020fd0;
        }
        local_490 = (undefined8 **)puVar9[3];
        local_498 = (undefined8 ***)puVar9[2];
        local_4a0 = (undefined8 ***)puVar9[1];
        local_4a8 = (undefined8 ***)*puVar9;
        local_348 = (char *)0x0;
        local_350 = (undefined8 ****)0x0;
        local_358 = (undefined8 ****)0x0;
        local_360 = (undefined8 ****)0x0;
        iVar5 = inferred_pump_window_1024(&local_4a8,&local_360,0x20);
        if ((iVar5 == 0) ||
           (iVar5 = inferred_pump_window_1024(&local_4a8,&DAT_ram_001b5cc8,0x20), iVar5 == 0)) {
          bVar1 = false;
          uVar16 = 1;
        }
        else {
          iVar5 = inferred_pump_window_1024(local_720 + 0x3a8,&local_4a8,0x20);
          bVar1 = false;
          uVar16 = 1;
          if (iVar5 != 0) {
            puVar9 = (undefined8 *)0x0;
            if (uVar12 != 3) {
              puVar9 = puVar8 + 0x12;
            }
            inferred_pump_window_0153(&local_360,puVar9);
            pppuVar2 = local_358;
            local_6d0 = local_358;
            local_6d8 = local_360;
            if (local_360 != (undefined8 ****)0x2) goto LAB_ram_00020fd0;
            local_348 = local_130;
            local_350 = local_138;
            local_358 = local_140;
            local_360 = (undefined8 ****)local_148;
            inferred_pump_window_0154(&local_4a8,pppuVar2,&local_360);
            local_6d0 = local_498;
            local_6d8 = local_4a0;
            if ((undefined8 ****)local_4a8 != (undefined8 ****)0x0) goto LAB_ram_00020fd0;
            bVar1 = true;
            uVar16 = 2;
            local_758 = local_498;
            if ((undefined8 ****)local_4a0 == (undefined8 ****)0x0) {
              inferred_pump_window_0155(&local_360,puVar8,uVar12,local_720 + 8);
              local_758 = local_358;
              local_6d0 = local_350;
              local_6d8 = local_358;
              if (local_360 != (undefined8 ****)0x0) goto LAB_ram_00020fd0;
              uVar16 = 3;
              local_750 = SUB81(local_350,0);
              bVar1 = true;
            }
          }
        }
        puVar9 = (undefined8 *)puVar8[3];
        iVar5 = inferred_pump_window_1024(puVar9,&local_168,0x20);
        if (iVar5 != 0) {
          inferred_pump_window_0588(&local_340,&DAT_ram_001b5e48);
          inferred_pump_window_0053(&local_328,&DAT_ram_001b5e48);
          local_358 = (undefined8 ***)0x1b6877;
          local_310 = 2;
          local_348 = (char *)CONCAT44(local_348._4_4_,0xf3);
          local_350 = (undefined8 ***)0x1e;
          local_360 = (undefined8 ****)0x0;
          local_2c8 = 0x17af;
          inferred_pump_window_0792(&local_518,&local_360);
          local_348 = (char *)puVar9[3];
          local_350 = (undefined8 ***)puVar9[2];
          local_358 = (undefined8 ***)puVar9[1];
          local_360 = (undefined8 ****)*puVar9;
          local_340 = (undefined8 ***)local_168;
          local_338 = (undefined8 ***)local_160;
          local_330 = (undefined8 ***)local_158;
          local_328 = (undefined8 **)local_150;
          inferred_pump_window_0798(&local_528,local_518,local_510,&local_360);
          local_6d0 = local_520;
          local_6d8 = local_528;
          goto LAB_ram_00020fd0;
        }
        iVar5 = inferred_pump_window_1024(puVar9,&DAT_ram_001b5ca8,0x20);
        if (((iVar5 == 0) &&
            (iVar5 = inferred_pump_window_1024(&local_148,&DAT_ram_001b5c88,0x20), iVar5 != 0)) &&
           (inferred_pump_window_0158(&local_538,puVar8), local_6d0 = local_530,
           local_6d8 = local_538, (undefined8 ****)local_538 != (undefined8 ****)0x2))
        goto LAB_ram_00020fd0;
        puVar9 = *(undefined8 **)(lVar15 + 0xe8);
        puVar10 = *(undefined8 **)*puVar9;
        local_348 = (char *)puVar10[3];
        local_350 = (undefined8 ***)puVar10[2];
        local_358 = (undefined8 ***)puVar10[1];
        local_360 = (undefined8 ****)*puVar10;
        inferred_pump_window_0754(&local_128,&local_360,&local_148,&local_168);
        puVar10 = (undefined8 *)puVar8[6];
        local_348 = (char *)puVar10[3];
        local_350 = (undefined8 ***)puVar10[2];
        local_358 = (undefined8 ***)puVar10[1];
        local_360 = (undefined8 ****)*puVar10;
        iVar5 = inferred_pump_window_1024(&local_360,&local_128,0x20);
        if (iVar5 != 0) {
          inferred_pump_window_0588(&local_340,&DAT_ram_001b5dc8);
          inferred_pump_window_0053(&local_328,&DAT_ram_001b5dc8);
          local_358 = (undefined8 ***)0x1b6877;
          local_310 = 2;
          local_348 = (char *)CONCAT44(local_348._4_4_,0x102);
          local_350 = (undefined8 ***)0x1e;
          local_360 = (undefined8 ****)0x0;
          local_2c8 = 0x17b1;
          inferred_pump_window_0792(&local_548,&local_360);
          local_348 = (char *)puVar10[3];
          local_350 = (undefined8 ***)puVar10[2];
          local_358 = (undefined8 ***)puVar10[1];
          local_360 = (undefined8 ****)*puVar10;
          local_340 = (undefined8 ***)local_128;
          local_338 = (undefined8 ***)local_120;
          local_330 = (undefined8 ***)local_118;
          local_328 = (undefined8 **)local_110;
          inferred_pump_window_0798(&local_558,local_548,local_540,&local_360);
          local_6d0 = local_550;
          local_6d8 = local_558;
          goto LAB_ram_00020fd0;
        }
        puVar10 = *(undefined8 **)(lVar15 + 0x100);
        puVar11 = (undefined8 *)*puVar10;
        local_18 = puVar11[3];
        local_20 = (undefined8 ***)puVar11[2];
        local_28 = (undefined8 ***)puVar11[1];
        local_30 = (undefined8 ***)*puVar11;
        plVar7 = *(longlong **)*puVar9;
        local_348 = (char *)plVar7[3];
        local_350 = (undefined8 ***)plVar7[2];
        local_358 = (undefined8 ***)plVar7[1];
        local_360 = (undefined8 ****)*plVar7;
        inferred_pump_window_0756(&local_4a8,&local_30,&local_360,&local_148,&local_168);
        inferred_pump_window_0115(local_f0,puVar10);
        inferred_pump_window_0115(&local_c0,puVar8 + 6);
        inferred_pump_window_0115(&local_90,*puVar9);
        inferred_pump_window_0115(&local_60,puVar8);
        inferred_pump_window_0115(&local_30,*(undefined8 *)(lVar15 + 0x108));
        inferred_pump_window_0115(auStack_270,puVar8 + 0xc);
        inferred_pump_window_1021(&local_360,local_f0,0x30);
        inferred_pump_window_1021(&local_330,&local_c0,0x30);
        inferred_pump_window_1021(auStack_300,&local_90,0x30);
        inferred_pump_window_1021(auStack_2d0,&local_60,0x30);
        inferred_pump_window_1021(auStack_2a0,&local_30,0x30);
        inferred_pump_window_0814(&local_108,&local_4a8,&local_360,6);
        if ((undefined8 ***)local_108 != (undefined8 ***)0x800000000000001a) {
          local_20 = (undefined8 ***)local_f8;
          local_28 = (undefined8 ***)local_100;
          local_30 = (undefined8 ***)local_108;
          inferred_pump_window_0793(&local_568,&local_30);
          inferred_pump_window_0073(&local_360);
          local_6d0 = local_560;
          local_6d8 = local_568;
          goto LAB_ram_00020fd0;
        }
        inferred_pump_window_0073(&local_360);
        local_4c0 = local_140;
        local_4b8 = local_138;
        local_4b0 = local_130;
        local_720 = *(longlong *)(lVar15 + 0xf8);
        local_188 = local_148;
        goto LAB_ram_0001ec60;
      }
    }
    bVar1 = false;
    local_4b0 = (char *)0x0;
    local_4b8 = (undefined8 ****)0x0;
    local_4c0 = (undefined8 ****)0x0;
    local_188 = (undefined8 ****)0x0;
    uVar16 = 0;
  }
LAB_ram_0001ec60:
  local_180 = local_4c0;
  local_178 = local_4b8;
  local_170 = local_4b0;
  if (lVar18 != 0) {
    local_490 = (undefined8 **)local_4b0;
    local_498 = local_4b8;
    local_4a0 = local_4c0;
    local_348 = (char *)0x0;
    local_350 = (undefined8 ****)0x0;
    local_358 = (undefined8 ****)0x0;
    local_360 = (undefined8 ****)0x0;
    local_4a8 = local_188;
    iVar5 = inferred_pump_window_1024(&local_4a8,&local_360,0x20);
    if (((iVar5 != 0) &&
        (iVar5 = inferred_pump_window_1024(&local_4a8,&DAT_ram_001b5cc8,0x20), iVar5 != 0)) &&
       (iVar5 = inferred_pump_window_1024(local_720 + 0x3a8,&local_4a8,0x20), iVar5 != 0)) {
      inferred_pump_window_0588(&local_340,&DAT_ram_001b5f00);
      inferred_pump_window_0053(&local_328,&DAT_ram_001b5f00);
      local_358 = (undefined8 ***)0x1b6877;
      local_310 = 2;
      local_348 = (char *)CONCAT44(local_348._4_4_,0x2f6);
      local_350 = (undefined8 ***)0x1e;
      local_360 = (undefined8 ****)0x0;
      local_2c8 = 0x17b7;
      inferred_pump_window_0792(&local_5b8,&local_360);
      local_6d0 = local_5b0;
      local_6d8 = local_5b8;
      goto LAB_ram_00020fd0;
    }
  }
  uVar12 = 0;
  if ((uVar6 != 0) && ((uVar16 & 2) == 2)) {
    if (*(char *)(local_720 + 0x43e) == '\0') {
      inferred_pump_window_0588(&local_340,"M");
      inferred_pump_window_0053(&local_328,"M");
      local_358 = (undefined8 ***)0x1b6877;
      local_310 = 2;
      local_348 = (char *)CONCAT44(local_348._4_4_,0x306);
      local_350 = (undefined8 ***)0x1e;
      local_360 = (undefined8 ****)0x0;
      local_2c8 = 0x17bd;
      inferred_pump_window_0792(&local_5d8,&local_360);
      local_6d0 = local_5d0;
      local_6d8 = local_5d8;
      goto LAB_ram_00020fd0;
    }
    uVar12 = uVar6;
    if (*(ulonglong *)(local_720 + 0x430) < uVar6) {
      inferred_pump_window_0588(&local_340,"N");
      inferred_pump_window_0053(&local_328,"N");
      local_358 = (undefined8 ***)0x1b6877;
      local_310 = 2;
      local_348 = (char *)CONCAT44(local_348._4_4_,0x30a);
      local_350 = (undefined8 ***)0x1e;
      local_360 = (undefined8 ****)0x0;
      local_2c8 = 0x17be;
      inferred_pump_window_0792(&local_5c8,&local_360);
      local_6d0 = local_5c0;
      local_6d8 = local_5c8;
      goto LAB_ram_00020fd0;
    }
  }
  uVar19 = 0;
  if (2 < uVar16) {
    uVar19 = local_750;
  }
  lVar17 = *(longlong *)(lVar15 + 0xe8);
  local_348 = (char *)0x0;
  local_350 = (undefined8 ****)0x0;
  local_358 = (undefined8 ****)0x0;
  local_360 = (undefined8 ****)0x0;
  iVar5 = inferred_pump_window_1024(&local_188,&local_360,0x20);
  if (iVar5 == 0) {
    ppppuVar13 = *(undefined8 *****)(local_720 + 0x3f0);
  }
  else {
    ppppuVar13 = *(undefined8 *****)(local_720 + 0x428);
    if (bVar1) {
      ppppuVar13 = (undefined8 ****)local_758;
    }
  }
  *(undefined8 *****)(lVar17 + 0x88) = ppppuVar13;
  *(undefined8 *****)(lVar17 + 0x50) = ppppuVar13;
  *(undefined8 *)(lVar17 + 0x48) = *(undefined8 *)(local_720 + 1000);
  *(undefined8 *)(lVar17 + 0x58) = *(undefined8 *)(local_720 + 0x3f8);
  *(undefined8 *)(lVar17 + 0x60) = 0;
  *(undefined8 *)(lVar17 + 0x68) = *(undefined8 *)(local_720 + 0x400);
  *(longlong *)(lVar17 + 0x20) = local_4e0;
  *(undefined8 ****)(lVar17 + 0x18) = local_4e8;
  *(undefined8 ****)(lVar17 + 0x10) = local_4f0;
  *(undefined8 ***)(lVar17 + 8) = local_4f8;
  *(char *)(lVar17 + 0xa2) = (char)lVar18;
  *(undefined1 *)(lVar17 + 0xa3) = 0;
  *(undefined8 ****)(lVar17 + 0x28) = local_188;
  *(undefined8 ****)(lVar17 + 0x30) = local_180;
  *(undefined8 ****)(lVar17 + 0x38) = local_178;
  *(char **)(lVar17 + 0x40) = local_170;
  *(char *)(lVar17 + 0xa5) = (char)lVar14;
  *(ulonglong *)(lVar17 + 0x70) = uVar12;
  *(undefined1 *)(lVar17 + 0xa0) = uVar19;
  *(undefined1 *)(lVar17 + 0xa4) = 0;
  *(undefined8 *)(lVar17 + 0x90) = 0;
  *(undefined8 *)(lVar17 + 0x98) = 0;
  uVar6 = param_3[2];
  if (uVar6 < 0x21) {
    uVar6 = param_4[2];
    if (0xd < uVar6) {
      inferred_pump_window_0588(&local_60,&DAT_ram_001b5f44);
      local_20 = (undefined8 ****)0x0;
      local_28 = (undefined8 ***)0x1;
      local_30 = (undefined8 ***)0x0;
      local_480 = (undefined8 ***)&DAT_ram_001bd838;
      local_488 = &local_30;
      local_470 = 3;
      local_478 = 0x20;
      local_498 = (undefined8 ****)0x0;
      local_4a8 = (undefined8 ****)0x0;
      lVar14 = inferred_pump_window_0590(&DAT_ram_001b5f44,&local_4a8);
      if (lVar14 != 0) goto LAB_ram_00020e60;
      local_318 = local_20;
      local_320 = local_28;
      local_328 = local_30;
      local_340 = local_60;
      local_338 = local_58;
      local_330 = local_50;
      local_358 = (undefined8 ***)0x1b6877;
      local_2c8 = 0x179c;
      local_310 = 2;
      local_348 = (char *)CONCAT44(local_348._4_4_,0x223);
      local_350 = (undefined8 ****)0x1e;
      local_360 = (undefined8 ****)0x0;
      inferred_pump_window_0792(&local_608,&local_360);
      inferred_pump_window_0007(&local_618,local_608,local_600,0xd,uVar6);
      local_6d0 = local_610;
      local_6d8 = local_618;
      goto LAB_ram_00021210;
    }
    uVar6 = puVar20[2];
    if (200 < uVar6) {
      inferred_pump_window_0588(&local_60,&DAT_ram_001b5e14);
      local_20 = (undefined8 ****)0x0;
      local_28 = (undefined8 ***)0x1;
      local_30 = (undefined8 ***)0x0;
      local_480 = (undefined8 ***)&DAT_ram_001bd838;
      local_488 = &local_30;
      local_470 = 3;
      local_478 = 0x20;
      local_498 = (undefined8 ****)0x0;
      local_4a8 = (undefined8 ****)0x0;
      lVar14 = inferred_pump_window_0590(&DAT_ram_001b5e14,&local_4a8);
      if (lVar14 != 0) goto LAB_ram_00020e60;
      local_318 = local_20;
      local_320 = local_28;
      local_328 = local_30;
      local_340 = local_60;
      local_338 = local_58;
      local_330 = local_50;
      local_358 = (undefined8 ***)0x1b6877;
      local_2c8 = 0x179d;
      local_310 = 2;
      local_348 = (char *)CONCAT44(local_348._4_4_,0x229);
      local_350 = (undefined8 ****)0x1e;
      local_360 = (undefined8 ****)0x0;
      inferred_pump_window_0792(&local_5e8,&local_360);
      inferred_pump_window_0007(&local_5f8,local_5e8,local_5e0,200,uVar6);
      local_6d0 = local_5f0;
      local_6d8 = local_5f8;
      goto LAB_ram_00021210;
    }
  }
  else {
    inferred_pump_window_0588(&local_60,&DAT_ram_001b5ee8);
    local_20 = (undefined8 ****)0x0;
    local_28 = (undefined8 ***)0x1;
    local_30 = (undefined8 ***)0x0;
    local_480 = (undefined8 ***)&DAT_ram_001bd838;
    local_488 = &local_30;
    local_470 = 3;
    local_478 = 0x20;
    local_498 = (undefined8 ****)0x0;
    local_4a8 = (undefined8 ****)0x0;
    lVar14 = inferred_pump_window_0590(&DAT_ram_001b5ee8,&local_4a8);
    if (lVar14 != 0) {
LAB_ram_00020e60:
                    /* WARNING: Subroutine does not return */
      inferred_pump_window_0961
                (&DAT_ram_001b5fa4,0x37,&local_c0,&DAT_ram_001bd868,&DAT_ram_001bd888);
    }
    local_318 = local_20;
    local_320 = local_28;
    local_328 = local_30;
    local_340 = local_60;
    local_338 = local_58;
    local_330 = local_50;
    local_358 = (undefined8 ***)0x1b6877;
    local_2c8 = 0x179b;
    local_310 = 2;
    local_348 = (char *)CONCAT44(local_348._4_4_,0x21d);
    local_350 = (undefined8 ****)0x1e;
    local_360 = (undefined8 ****)0x0;
    inferred_pump_window_0792(&local_628,&local_360);
    inferred_pump_window_0007(&local_638,local_628,local_620,0x20,uVar6);
    local_6d0 = local_630;
    local_6d8 = local_638;
LAB_ram_00021210:
    if ((undefined8 ****)local_6d8 != (undefined8 ****)0x2) goto LAB_ram_00020fd0;
  }
  inferred_pump_window_0939(&local_30);
  inferred_pump_window_0939(&local_4a8,param_4);
  inferred_pump_window_0939(&local_360,puVar20);
  uVar19 = *(undefined1 *)(param_2 + 0x20);
  inferred_pump_window_0159(&local_648,lVar15,uVar19,&local_30);
  local_6d0 = local_640;
  local_6d8 = local_648;
  if (((undefined8 ****)local_648 == (undefined8 ****)0x2) &&
     (((lVar18 == 0 ||
       (inferred_pump_window_0314(&local_658,param_2), local_6d0 = local_650, local_6d8 = local_658,
       (undefined8 ****)local_658 == (undefined8 ****)0x2)) &&
      (inferred_pump_window_0160(&local_668,lVar15,uVar19,lVar18), local_6d0 = local_660,
      local_6d8 = local_668, (undefined8 ****)local_668 == (undefined8 ****)0x2)))) {
    local_80 = param_3[2];
    local_88 = param_3[1];
    local_90 = *param_3;
    local_50 = (undefined8 ***)param_4[2];
    local_58 = (undefined8 ***)param_4[1];
    local_60 = (undefined8 ***)*param_4;
    local_20 = (undefined8 ***)puVar20[2];
    local_28 = (undefined8 ***)puVar20[1];
    local_30 = (undefined8 ***)*puVar20;
    inferred_pump_window_0163(&local_360,&local_90,&local_60,&local_30);
    pppuVar4 = local_350;
    pppuVar3 = local_358;
    pppuVar2 = local_360;
    local_6d0 = local_350;
    local_6d8 = local_358;
    if (local_360 != (undefined8 ****)0x8000000000000000) {
      inferred_pump_window_1021(&local_490,&local_348,0x130);
      local_498 = pppuVar4;
      local_4a0 = pppuVar3;
      local_4a8 = pppuVar2;
      inferred_pump_window_0594(&local_360,&local_4a8);
      local_28 = local_350;
      local_30 = local_358;
      inferred_pump_window_0813(&local_30,1);
      inferred_pump_window_0115(local_218,lVar15 + 0x80);
      uVar19 = *(undefined1 *)(param_2 + 0x26);
      inferred_pump_window_0594(&local_1e8,&local_4a8);
      local_1a8 = &DAT_ram_001b64c7;
      local_1b0 = &DAT_ram_001b64bf;
      local_1c0 = local_1e8;
      local_1c8 = local_1e0;
      local_1d0 = local_1e0;
      local_1b8 = local_1e0 + local_1d8;
      inferred_pump_window_0124(&local_90,&local_1d0);
      uVar12 = local_80;
      uVar6 = local_88;
      local_28 = (undefined8 ***)inferred_pump_window_0089(0x22,1);
      lVar14 = local_218[0][3];
      lVar18 = local_218[0][2];
      lVar15 = local_218[0][1];
      *local_28 = (undefined8 **)*local_218[0];
      local_28[1] = (undefined8 **)lVar15;
      local_28[2] = (undefined8 **)lVar18;
      local_28[3] = (undefined8 **)lVar14;
      *(undefined2 *)(local_28 + 4) = 1;
      local_30 = (undefined8 ***)0x1;
      local_20 = (undefined8 ***)0x1;
      inferred_pump_window_0874(&local_360,&DAT_ram_001b79df,uVar6,uVar12,&local_30);
      local_6d0 = &local_30;
      inferred_pump_window_1021(local_6d0,local_218,0x30);
      local_c0 = &local_60;
      local_50 = (undefined8 ***)local_f0;
      local_60 = (undefined8 ***)0x1b6807;
      local_b8 = 2;
      local_48 = 1;
      local_58 = (undefined8 ***)0x11;
      local_f0[0] = uVar19;
      inferred_pump_window_0815(local_1a0,&local_360,local_6d0,1);
      if (local_1a0[0] == -0x7fffffffffffffe6) {
        lVar14 = (longlong)*local_28;
        *local_28 = (undefined8 **)(lVar14 + -1);
        if (lVar14 + -1 == 0) {
          local_28[1] = (undefined8 **)((longlong)local_28[1] + -1);
        }
        lVar14 = (longlong)*local_20;
        *local_20 = (undefined8 **)(lVar14 + -1);
        if (lVar14 + -1 == 0) {
          local_20[1] = (undefined8 **)((longlong)local_20[1] + -1);
        }
        local_6d8 = (undefined8 ****)0x2;
      }
      else {
        inferred_pump_window_0793(&local_678,local_1a0);
        lVar14 = (longlong)*local_28;
        *local_28 = (undefined8 **)(lVar14 + -1);
        if (lVar14 + -1 == 0) {
          local_28[1] = (undefined8 **)((longlong)local_28[1] + -1);
        }
        lVar14 = (longlong)*local_20;
        *local_20 = (undefined8 **)(lVar14 + -1);
        local_6d0 = local_670;
        local_6d8 = local_678;
        if (lVar14 + -1 == 0) {
          local_20[1] = (undefined8 **)((longlong)local_20[1] + -1);
        }
      }
    }
  }
LAB_ram_00020fd0:
  param_1[1] = local_6d0;
  *param_1 = local_6d8;
  return;
}

