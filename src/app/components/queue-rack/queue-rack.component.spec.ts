/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatProgressBarModule } from '@angular/material';
import { configureTestSuite } from 'ng-bullet';

import { QueueRackComponent } from './queue-rack.component';

describe('QueueRackComponent', () => {
  let component: QueueRackComponent;
  let fixture: ComponentFixture<QueueRackComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [QueueRackComponent],
      imports: [MatCardModule, MatProgressBarModule],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueRackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
